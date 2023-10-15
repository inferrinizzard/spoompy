import { randomUUID } from 'crypto';

import { RateLimitedError } from '../handlers';

type BaseThunk<Return = unknown> = () => Promise<Return>;

// benchmark 30 requests / seconds = wait 35ms between each ?
const MAX_CONCURRENT_REQUESTS = 30;

export class RequestQueue {
  public idQueue: Record<string, number>; // id: order

  public thunkMap: Record<string, BaseThunk>;

  private readonly inFlightRequests: Map<string, string>; // id: timestamp

  public retryAfter: number;

  private readonly toRetry: string[][]; // ids

  private counter = 0;

  // keep track of inflight requests
  public constructor() {
    this.thunkMap = {};
    this.idQueue = {};
    this.inFlightRequests = new Map();

    this.retryAfter = 0;
    this.toRetry = [];
  }

  public add = (thunk: BaseThunk): string => {
    const newId = randomUUID();
    this.idQueue[newId] = ++this.counter;

    this.thunkMap[newId] = thunk;

    return newId;
  };

  public runOne = async <ReturnType>(id: string): Promise<ReturnType> =>
    (await this.runGroup<ReturnType>([id]))[0];

  public runGroup = async <ReturnType>(
    ids: string[],
  ): Promise<ReturnType[]> => {
    let failed: string[] = [];

    let out = [];
    for (let i = 0; i < ids.length; i++) {
      const thunkId = ids[i];

      // skip unknown ids
      if (!(thunkId in this.thunkMap)) {
        continue;
      }

      // do not execute if max # of requests reached, try again later
      if (this.inFlightRequests.size >= MAX_CONCURRENT_REQUESTS) {
        failed.push(thunkId);
        continue;
      }

      const thunk = this.thunkMap[thunkId] as BaseThunk<ReturnType>;
      try {
        this.inFlightRequests.set(thunkId, Date.now().toString());
        const res = await thunk().then((data) => {
          this.inFlightRequests.delete(thunkId);
          return data;
        });
        out.push(res);
      } catch (error) {
        failed.push(thunkId);
        if (error instanceof RateLimitedError) {
          this.retryAfter = error.retryAfter;
          failed = failed.concat(ids.slice(i));
          break;
        }
      }
    }

    if (failed.length) {
      this.toRetry.push(failed);
    }

    // setTimeout(async () => {
    //   await this.runGroup(failed);
    // }, this.retryAfter * 1000);

    return out;
  };
}
