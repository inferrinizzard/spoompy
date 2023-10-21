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
  public idQueue: Record<number, string>; // index: id

  public thunkMap: Record<string, BaseThunk>;

  private readonly inFlightRequests: Map<string, string>; // id: timestamp

  public retryTimer: Promise<void> | null;

  private counter = 0;

  private index = 0;

  // keep track of inflight requests
  public constructor() {
    this.thunkMap = {};
    this.idQueue = {};
    this.inFlightRequests = new Map();

    this.retryTimer = null;
  }

  public add = (thunk: BaseThunk): string => {
    const newId = crypto.randomUUID();
    this.idQueue[this.counter++] = newId;

    this.thunkMap[newId] = thunk;

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
        .catch<ThunkError>((error: Error) => {
          this.inFlightRequests.delete(thunkId);
          if (error instanceof RateLimitedError) {
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

  private readonly getIds = (): string[] => {
    const idRange = {
      start: this.index,
      end: Math.min(this.counter, this.index + MAX_CONCURRENT_REQUESTS),
    };

    const ids = new Array(idRange.end - idRange.start)
      .fill(0)
      .map((_, i) => this.idQueue[i]);

    this.index = idRange.end;

    return ids;
  };

  public runAll = async <Return>(): Promise<RequestBatch<Return>> => {
    const ids = this.getIds();

    let batchPromise = this.runBatch<Return>(ids);
    if (this.index < this.counter) {
      batchPromise = batchPromise.then((batch) => {
        batch.next = async () => await this.runAll<Return>();
        return batch;
      });
    }

    return await batchPromise;
  };

  public runBatch = async <Return>(
    ids: string[],
  ): Promise<RequestBatch<Return>> => {
    const batchIds = ids.slice(0, MAX_CONCURRENT_REQUESTS);
    const nextIds = ids.slice(MAX_CONCURRENT_REQUESTS);

    if (this.retryTimer) {
      await this.retryTimer.then(() => (this.retryTimer = null));
    }

    const thunkPromises = batchIds
      .filter((thunkId) => thunkId in this.thunkMap)
      .map(async (thunkId) => {
        const thunk = this.thunkMap[thunkId];
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
            nextIds.push(thunkError.thunkId);
          }
        } else {
          data.push(result.value as Return);
        }
      }
    }

    const next = nextIds.length
      ? async () => await this.runBatch<Return>(nextIds)
      : null;

    return { data, next };
  };
}
