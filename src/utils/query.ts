export const distinctBy = <
  const Key extends string,
  T extends Record<Key, string>,
>(
  data: T[],
  key: Key,
): Array<T[Key]> => [
  ...data.reduce(
    (acc, datum) => new Set([...acc, datum[key]]),
    new Set<T[Key]>(),
  ),
];

export const groupBy = <
  const Key extends string,
  T extends Record<Key, string>,
>(
  data: T[],
  key: Key,
): Record<T[Key], T[]> =>
  data.reduce(
    (acc, datum) => ({
      ...acc,
      [datum[key]]: (acc[datum[key]] ?? []).concat([datum]),
    }),
    {} as Record<T[typeof key], T[]>,
  );

// T = <K, V> where T[K] = V extends string
export const countBy = <
  const Key extends string,
  T extends Record<Key, string>,
>(
  data: T[],
  key: Key,
): Record<T[Key], number> =>
  data.reduce(
    (acc, datum) => ({
      ...acc,
      [datum[key]]: (acc[datum[key]] ?? 0) + 1,
    }),
    {} as Record<T[typeof key], number>,
  );
