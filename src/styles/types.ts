export type CssUnit = number | string;

export type TransientProps<Props> = {
  [Key in keyof Props as `$${Key & string}`]: Props[Key];
};
