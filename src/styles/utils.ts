export const parseCssUnit = (unit: number | string): string =>
  Number.isNaN(unit) ? (unit as string) : `${unit}px`;
