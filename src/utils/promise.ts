import { GenericFunction, Nullable } from '../types/generic';

import { noop } from './noop';

export const wait = (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export const unresolvedPromise = (action: Nullable<GenericFunction>) => new Promise(action ?? noop);
