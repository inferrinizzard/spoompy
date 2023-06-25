export const distinctBy = <const T, const K extends keyof T>(data: T[], key: K) => [
  ...data.reduce((acc, datum) => new Set([...acc, datum[key]]), new Set<T[K]>()),
];
