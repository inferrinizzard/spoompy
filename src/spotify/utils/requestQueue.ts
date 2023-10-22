import { RateLimitedError } from '../handlers';

type BaseThunk<Return = unknown> = () => Promise<Return>;
interface RequestBatch<Data> {
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
  public idQueue: Map<string, number>;

  public thunkMap: Map<string, BaseThunk>;

  private readonly inFlightRequests: Map<string, string>; // id: timestamp

  public retryTimer: Promise<void> | null;

  private counter = 0;

  public constructor() {
    this.thunkMap = new Map();
    this.idQueue = new Map();
    this.inFlightRequests = new Map();

    this.retryTimer = null;
  }

  public add = (thunk: BaseThunk): string => {
    const newId = crypto.randomUUID();
    this.idQueue.set(newId, this.counter++);

    this.thunkMap.set(newId, thunk);

    return newId;
  };

  private readonly composeThunk = <
    ReturnType,
    Thunk extends BaseThunk<ReturnType>,
  >(
    thunkId: string,
    thunk: Thunk,
  ): (() => Promise<ReturnType | ThunkError>) => {
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

  public runAll = async <Return>(): Promise<RequestBatch<Return>> => {
    return await this.run<Return>(
      () => this.idQueue,
      (id) => this.idQueue.set(id, this.counter++),
    );
  };

  public runBatch = async <Return>(
    ids: string[],
  ): Promise<RequestBatch<Return>> => {
    let idQueue = new Map(
      ids.map((id) => {
        // try remove dupes from main queue
        this.idQueue.delete(id);
        return [id, this.counter++];
      }),
    );

    return await this.run<Return>(
      () => idQueue,
      (id) => idQueue.set(id, this.counter++),
    );
  };

  private readonly run = async <Return>(
    getIdMap: () => Map<string, number>,
    requeue: (id: string) => void,
  ): Promise<RequestBatch<Return>> => {
    const batchIds = Object.keys(getIdMap())
      .slice(0, MAX_CONCURRENT_REQUESTS)
      .map((id) => {
        getIdMap().delete(id);
        return id;
      });

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
            requeue(thunkError.thunkId);
          }
        } else {
          data.push(result.value as Return);
        }
      }
    }

    const next = getIdMap().size
      ? async () => await this.run<Return>(getIdMap, requeue)
      : null;

    return { data, next };
  };
}
