export type Many<T> = T | T[];

export function manyToArray<T>(many: Many<T>): T[] {
  if (Array.isArray(many)) {
    return many;
  }
  return [many];
}
