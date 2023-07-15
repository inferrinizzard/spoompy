export type SpliceObject<Obj, Key extends keyof Obj, Val> = Omit<Obj, Key> & Record<Key, Val>;

export type MergeTypes<Types extends unknown[]> = Types extends [infer Head, ...infer Rest]
  ? Head & MergeTypes<Rest>
  : {};
