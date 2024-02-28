import { RateLimitedError } from '../handlers';

type ThunkId = string;
type BaseThunk<Return = unknown> = () => Promise<Return>;
export interface RequestBatch<Data> {
  data: Data[];
  next: (() => Promise<RequestBatch<Data>>) | null;
}

interface ThunkError<ErrorType extends Error = Error> {
  error?: ErrorType;
  thunkId: ThunkId;
}

// benchmark 30 requests / seconds = wait 35ms between each ?
const MAX_CONCURRENT_REQUESTS = 30;

const MIN_MS_BETWEEN_BATCHES = 1000;

export class RequestQueue {
  // queue of promise ids to be called in order
  public idQueue: ThunkId[];

  // map of promise ids to promise thunks
  public thunkMap: Map<ThunkId, BaseThunk>;

  // map of ongoing promises, keyed by id to timestamp when called
  private readonly inFlightRequests: Map<ThunkId, string>;

  // setInterval timer to allow for retries or retryAfter
  public retryTimer: Promise<void> | null;

  public constructor() {
    this.thunkMap = new Map();
    this.idQueue = [];
    this.inFlightRequests = new Map();

    this.retryTimer = null;
  }

  // creates new hash for promise thunk, adds to map and pushes to queue
  public add = <Return, Thunk extends BaseThunk<Return>>(
    thunk: Thunk,
  ): ThunkId => {
    const newId: ThunkId = crypto.randomUUID();
    this.idQueue.push(newId);

    this.thunkMap.set(newId, thunk);

    return newId;
  };

  // finds all Ids from this map that also exist in the internal map
  // returns a list with max length MAX_CONCURRENT_REQUESTS
  private readonly getIds = (idMap?: Record<string, unknown>): ThunkId[] => {
    if (idMap) {
      let outIds: ThunkId[] = [];
      for (
        let i = 0, n = 1;
        n <= MAX_CONCURRENT_REQUESTS && i < this.idQueue.length;

      ) {
        const id = this.idQueue[i];
        if (!(id in idMap)) {
          i++;
          continue;
        }

        this.idQueue.splice(i, 1);
        outIds.push(id);
        n++;
      }

      return outIds;
    }

    // TODO: double check this fallback
    return this.idQueue.splice(0, MAX_CONCURRENT_REQUESTS);
  };

  // check if all Ids from this map exist in the queue
  private readonly hasIds = (idMap?: Record<string, unknown>): boolean => {
    if (idMap) {
      return this.idQueue.some((id) => id in idMap);
    }

    // TODO: double check this fallback
    return this.idQueue.length > 0;
  };

  // adds error handling and rate limiting logic to existing thunk
  private readonly composeThunk = <Return, Thunk extends BaseThunk<Return>>(
    thunkId: string,
    thunk: Thunk,
  ): (() => Promise<Return | ThunkError>) => {
    // if currently at capacity, return id to retry
    if (this.inFlightRequests.size >= MAX_CONCURRENT_REQUESTS) {
      return async () => await Promise.resolve({ thunkId });
    }

    return async () => {
      this.inFlightRequests.set(thunkId, Date.now().toString());
      return await thunk()
        .then((data) => {
          // remove completed thunk from map to prevent re-call
          this.thunkMap.delete(thunkId);
          return data;
        })
        .catch<ThunkError>((error: Error) => {
          // if hit rate limit, set retryTimer and return Id to retry
          if (error instanceof RateLimitedError && !this.retryTimer) {
            console.info(
              `[SDK] Encountered rate limit, Retrying After: ${error.retryAfter} seconds`,
            );

            this.retryTimer = new Promise<void>((resolve) =>
              setTimeout(() => {
                resolve();
              }, error.retryAfter * 1000),
            );
            return { thunkId };
          }

          // else return proper error
          return { error, thunkId };
        })
        .finally(() => {
          // remove from in-flight requests, regardless of result
          this.inFlightRequests.delete(thunkId);
        });
    };
  };

  public runBatch = async <Return>(
    ids: string[],
  ): Promise<RequestBatch<Return>> =>
    await this.run<Return>(Object.fromEntries(ids.map((id, i) => [id, i])));

  public run = async <Return>(
    idMap?: Record<string, number>,
  ): Promise<RequestBatch<Return>> => {
    const batchIds = this.getIds(idMap);

    if (this.retryTimer) {
      await this.retryTimer.then(() => (this.retryTimer = null));
    }

    const thunkPromises = batchIds
      .filter((thunkId) => this.thunkMap.has(thunkId))
      .map(async (thunkId) => {
        const thunk = this.thunkMap.get(thunkId) as BaseThunk;
        // console.log('running thunk:', thunkId);
        return await this.composeThunk(thunkId, thunk)();
      });

    let data = [];
    const results = await Promise.allSettled(thunkPromises);
    for (const result of results) {
      if (result.status === 'rejected') {
        throw Error(`Unknown result! ${result.status}`);
      }

      if (result.value) {
        if ('error' in (result.value as object)) {
          const thunkError = result.value as ThunkError;

          // TODO: check instead if error is retriable
          if (!thunkError.error) {
            this.idQueue.push(thunkError.thunkId);
          }
        } else {
          data.push(result.value as Return);
        }
      }
    }

    // add buffer in between batches (may change to streaming)
    const timer = new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, MIN_MS_BETWEEN_BATCHES),
    );

    // if all thunks have been run
    if (!this.hasIds(idMap)) {
      return { data, next: null };
    }

    // compose next recursive batch for successive thunks
    const next = async () =>
      await Promise.allSettled([this.run<Return>(idMap), timer]).then(
        ([batch]) =>
          (batch as PromiseFulfilledResult<RequestBatch<Return>>).value,
      );

    return { data, next };
  };
}
