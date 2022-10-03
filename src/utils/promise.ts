import { noop } from './noop';
import { GenericFunction, Nullable } from '../types/generic';

export const wait = (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

export const unresolvedPromise = (action: Nullable<GenericFunction>) => {
  new Promise(action ?? noop) as Promise<unknown>;
};
