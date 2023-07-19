export const distinctBy = <const T, const K extends keyof T>(data: T[], key: K) => [
  ...data.reduce((acc, datum) => new Set([...acc, datum[key]]), new Set<T[K]>()),
];

export const groupBy = <const Key extends string, T extends Record<Key, string>>(
  tracks: T[],
  key: Key
) =>
  tracks.reduce(
    (acc, track) => ({
      ...acc,
      [track[key]]: (acc[track[key]] ?? []).concat([track]),
    }),
    {} as Record<T[typeof key], T[]>
  );

// T = <K, V> where T[K] = V extends string
export const countBy = <const Key extends string, T extends Record<Key, string>>(
  tracks: T[],
  key: Key
) =>
  tracks.reduce(
    (acc, track) => ({
      ...acc,
      [track[key]]: (acc[track[key]] ?? 0) + 1,
    }),
    {} as Record<T[typeof key], number>
  );
