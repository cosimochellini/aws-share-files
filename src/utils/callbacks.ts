import { GenericFunction } from '../types/generic';

export function debounce<T>(
  func: (...args: T[]) => unknown,
  delay = 200,
): typeof func {
  let timeout: number | NodeJS.Timeout;
  return function debounced(...args: T[]) {
    clearTimeout(timeout as number);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export const throttle = <T>(func: GenericFunction<T>, limit = 100) => {
  let flag = true;
  return function throttled(...args) {
    if (flag) {
      func.apply(this, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, limit);
    }
  } as GenericFunction<T>;
};
