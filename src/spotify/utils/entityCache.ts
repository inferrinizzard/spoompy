export class EntityCache {
  public set = <Value>(id: string, value: Value): void => {
    localStorage.setItem(id, JSON.stringify(value));
  };

  public get = <Return>(id: string): Return | null => {
    const value = localStorage.getItem(id);
    if (value) {
      return JSON.parse(value);
    }

    return null;
  };
}
