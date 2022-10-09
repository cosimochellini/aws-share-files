import { Nullable } from '../types/generic';

export function trowIfNull<T>(value: Nullable<T> | null): T {
  if (value === null || value === undefined) { throw new Error('Value is null or undefined, cannot be used.'); }

  return value;
}
