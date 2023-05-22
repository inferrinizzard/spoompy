export const distinctBy = <T>(data: T[], key: keyof T) => [
  ...data.reduce((acc, datum) => new Set([...acc, datum[key]]), new Set<T[typeof key]>()),
];
