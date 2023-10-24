import { RequestQueue } from './requestQueue';

let queue: RequestQueue;
describe('Request Queue', () => {
  beforeEach(() => {
    queue = new RequestQueue();
  });

  it('adds thunks to queue', () => {
    queue.add(async () => await Promise.resolve());

    expect(queue.idQueue.length).toBeGreaterThan(0);
  });

  it('runs thunks in queue', async () => {
    queue.add(async () => await Promise.resolve({}));

    const batch = queue.run();

    await batch.then(({ data, next }) => {
      expect(data).toHaveLength(1);
      expect(next).toBeNull();
      expect(queue.idQueue.length).toBe(0);
    });
  });

  it('batches thunks in queue when more than max concurrent', async () => {
    for (let i = 0; i < 31; i++) {
      queue.add(async () => await Promise.resolve({}));
    }

    const batch = queue.run();

    await batch.then(({ next }) => {
      expect(next).toBeDefined();
      expect(queue.idQueue.length).toBe(1); // did not run rest of queue yet
    });
  });

  it('waits for timer when calling next', async () => {
    for (let i = 0; i < 31; i++) {
      queue.add(async () => await Promise.resolve({}));
    }

    const batch = queue.run();

    let startTime: number;

    await batch
      .then(async ({ next }) => {
        expect(next).toBeDefined();
        expect(queue.idQueue.length).toBe(1); // did not run rest of queue yet
        startTime = Date.now();
        return await next?.();
      })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { data, next } = res!;
        expect(next).toBeNull();
        expect(data.length).toBe(1);
        expect(queue.idQueue.length).toBe(0); // ran all of queue
        expect(Date.now() - startTime).toBeGreaterThan(1000); // more than 1 second delay
      });
  });

  it('only runs thunks in batch', async () => {
    let thunkIds = [];

    queue.add(async () => await Promise.resolve({})); // not part of batch

    for (let i = 0; i < 10; i++) {
      thunkIds.push(queue.add(async () => await Promise.resolve({})));
    }

    const batch = queue.runBatch(thunkIds);

    await batch.then(() => {
      expect(queue.idQueue.length).toBe(1);
    });
  });

  it('only runs thunks in batch with overflow', async () => {
    let thunkIds = [];

    queue.add(async () => await Promise.resolve({})); // not part of batch

    for (let i = 0; i < 31; i++) {
      thunkIds.push(queue.add(async () => await Promise.resolve({})));
    }

    queue.add(async () => await Promise.resolve({})); // not part of batch

    const batch = queue.runBatch(thunkIds);

    await batch
      .then(async ({ next }) => {
        expect(next).toBeDefined();
        expect(queue.idQueue.length).toBe(3);
        return await next?.();
      })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { next } = res!;
        expect(next).toBeNull();
        expect(queue.idQueue.length).toBe(2); // ran all of queue in provided batch
      });
  });
});
