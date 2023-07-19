import { type MergeTypes } from './util';

type IdObj = { id: string };

export type EntityKvp<Entity extends IdObj> = Record<Entity['id'], Entity>;

export type EntityMap<Entities extends IdObj[]> = MergeTypes<{
  [Index in keyof Entities]: EntityKvp<Entities[Index]>;
}>;

export type IdsOf<Entities extends IdObj[]> = {
  [Index in keyof Entities]: Entities[Index]['id'];
};
