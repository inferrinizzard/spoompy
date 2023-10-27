import { RateLimitedError } from '../handlers';

type BaseThunk<Return = unknown> = () => Promise<Return>;
export interface RequestBatch<Data> {
  data: Data[];
  next: (() => Promise<RequestBatch<Data>>) | null;
}

interface ThunkError<ErrorType extends Error = Error> {
  error?: ErrorType;
  thunkId: string;
}

// benchmark 30 requests / seconds = wait 35ms between each ?
const MAX_CONCURRENT_REQUESTS = 30;

const MIN_MS_BETWEEN_BATCHES = 1000;

export class RequestQueue {
  public idQueue: string[];

  public thunkMap: Map<string, BaseThunk>;

  private readonly inFlightRequests: Map<string, string>; // id: timestamp

  public retryTimer: Promise<void> | null;

  public constructor() {
    this.thunkMap = new Map();
    this.idQueue = [];
    this.inFlightRequests = new Map();

    this.retryTimer = null;
  }

  public add = <Return, Thunk extends BaseThunk<Return>>(
    thunk: Thunk,
  ): string => {
    const newId = crypto.randomUUID();
    this.idQueue.push(newId);

    this.thunkMap.set(newId, thunk);

    return newId;
  };

  private readonly getIds = (idMap?: Record<string, unknown>): string[] => {
    if (idMap) {
      let outIds: string[] = [];
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

    return this.idQueue.splice(0, MAX_CONCURRENT_REQUESTS);
  };

  private readonly hasIds = (idMap?: Record<string, unknown>): boolean => {
    if (idMap) {
      return this.idQueue.some((id) => id in idMap);
    }

    return this.idQueue.length > 0;
  };

  private readonly composeThunk = <Return, Thunk extends BaseThunk<Return>>(
    thunkId: string,
    thunk: Thunk,
  ): (() => Promise<Return | ThunkError>) => {
    if (this.inFlightRequests.size >= MAX_CONCURRENT_REQUESTS) {
      return async () => await Promise.resolve({ thunkId });
    }

    this.inFlightRequests.set(thunkId, Date.now().toString());

    return async () =>
      await thunk()
        .then((data) => {
          this.thunkMap.delete(thunkId);
          return data;
        })
        .catch<ThunkError>((error: Error) => {
          if (error instanceof RateLimitedError && !this.retryTimer) {
            console.log('rate limit!, waiting', error.retryAfter, 'seconds');

            this.retryTimer = new Promise<void>((resolve) =>
              setTimeout(() => {
                resolve();
              }, error.retryAfter * 1000),
            );
            return { thunkId };
          }

          return { error, thunkId };
        })
        .finally(() => {
          this.inFlightRequests.delete(thunkId);
        });
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

    const timer = new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, MIN_MS_BETWEEN_BATCHES),
    );
    const next = this.hasIds(idMap)
      ? async () =>
          await Promise.allSettled([this.run<Return>(idMap), timer]).then(
            ([batch]) =>
              (batch as PromiseFulfilledResult<RequestBatch<Return>>).value,
          )
      : null;

    return { data, next };
  };
}
