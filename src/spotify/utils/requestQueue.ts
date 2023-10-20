import { randomUUID } from 'crypto';

import { RateLimitedError } from '../handlers';

type BaseThunk<Return = unknown> = () => Promise<Return>;
interface RequestBatch<Data> {
  data: Data[];
  next: (() => Promise<RequestBatch<Data>>) | null;
}

// benchmark 30 requests / seconds = wait 35ms between each ?
const MAX_CONCURRENT_REQUESTS = 30;

const MIN_MS_BETWEEN_BATCHES = 1000;

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

  private readonly composeThunk = <
    ReturnType,
    Thunk extends BaseThunk<ReturnType>,
  >(
    thunkId: string,
    thunk: Thunk,
  ): Thunk | (() => Promise<null>) => {
    if (this.inFlightRequests.size >= MAX_CONCURRENT_REQUESTS) {
      return async () => await Promise.resolve(null);
    }

    this.inFlightRequests.set(thunkId, Date.now().toString());
    return async () =>
      await thunk()
        .catch((error) => {
          this.inFlightRequests.delete(thunkId);
          if (error instanceof RateLimitedError) {
            this.retryAfter = error.retryAfter;
            return null;
          }

          return error;
        })
        .finally(() => {
          this.inFlightRequests.delete(thunkId);
        });
  };

  public runBatch = async <Return>(
    ids: string[],
  ): Promise<RequestBatch<Return>> => {
    const batchIds = ids.slice(0, MAX_CONCURRENT_REQUESTS);
    const nextIds = ids.slice(MAX_CONCURRENT_REQUESTS);

    const thunkPromises = batchIds
      .filter((thunkId) => thunkId in this.thunkMap)
      .map(async (thunkId) => {
        const thunk = this.thunkMap[thunkId];
        return await this.composeThunk(thunkId, thunk)();
      });

    const timer = new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, MIN_MS_BETWEEN_BATCHES),
    );

    thunkPromises.push(timer);

    // handle error, rate limits, add thunk id, paging
    let data = [];
    const results = await Promise.allSettled(thunkPromises);
    for (const result of results) {
      if (result.status === 'rejected') {
        // nextIds.push(''); // return Id;
        continue;
      }

      if (result.value) {
        data.push(result.value as Return);
      }
    }

    const next = nextIds.length
      ? async () => await this.runBatch<Return>(nextIds)
      : null;

    return { data, next };
  };
}
