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
    const batchIds = this.idQueue
      .splice(0, MAX_CONCURRENT_REQUESTS)
      .filter((id) => (idMap ? id in idMap : true));

    if (this.retryTimer) {
      await this.retryTimer.then(() => (this.retryTimer = null));
    }

    const thunkPromises = batchIds
      .filter((thunkId) => this.thunkMap.has(thunkId))
      .map(async (thunkId) => {
        const thunk = this.thunkMap.get(thunkId) as BaseThunk;
        console.log('running thunk:', thunkId);
        return await this.composeThunk(thunkId, thunk)();
      });

    const timer = new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, MIN_MS_BETWEEN_BATCHES),
    );

    thunkPromises.push(timer);

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

    const next = this.hasIds(idMap)
      ? async () => await this.run<Return>(idMap)
      : null;

    return { data, next };
  };
}
