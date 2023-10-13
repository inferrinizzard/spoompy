import { randomUUID } from 'crypto';

import { RateLimitedError } from '../handlers';

type BaseThunk<Return = unknown> = () => Promise<Return>;

// benchmark 30 requests / seconds = wait 35ms between each ?
export class RequestQueue {
  public idQueue: string[];

  public thunkMap: Record<string, BaseThunk>;

  public retryAfter: number;

  private readonly toRetry: string[][];

  public constructor() {
    this.thunkMap = {};
    this.idQueue = [];

    this.retryAfter = 0;
    this.toRetry = [];
  }

  public add = (thunk: BaseThunk): string => {
    const newId = randomUUID();
    this.idQueue.push(newId);

    this.thunkMap[newId] = thunk;

    return newId;
  };

  public runOne = async <ReturnType>(id: string): Promise<ReturnType> =>
    (await this.runGroup<ReturnType>([id]))[0];

  public runGroup = async <ReturnType>(
    ids: string[],
  ): Promise<ReturnType[]> => {
    let failed = [];

    let out = [];
    for (let i = 0; i < ids.length; i++) {
      const thunkId = ids[i];

      if (!(thunkId in this.thunkMap)) {
        continue;
      }

      const thunk = this.thunkMap[thunkId] as BaseThunk<ReturnType>;
      try {
        const res = await thunk();
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

    return out;
  };
}
