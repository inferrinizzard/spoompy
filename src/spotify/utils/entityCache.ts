import { compress as compressLZ, decompress as decompressLZ } from 'lz-string';
import { parse, stringify } from 'zipson';

export class EntityCache {
  public set = <Value>(id: string, value: Value): void => {
    localStorage.setItem(id, this.compress(value));
  };

  public get = <Return>(id: string): Return | null => {
    const value = localStorage.getItem(id);
    if (value) {
      return this.decompress(value);
    }

    return null;
  };

  private readonly compress = (obj: unknown): string => {
    return compressLZ(stringify(obj));
  };

  private readonly decompress = <Return>(str: string): Return => {
    return parse(decompressLZ(str));
  };
}
