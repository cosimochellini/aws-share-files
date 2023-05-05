import { useState } from 'react';

import { useEffectOnceWhen } from './once';

export const useSSRSafeStore = <T>(state: T, defaultState: T) => {
  const [initialized, setInitialized] = useState(false);

  useEffectOnceWhen(() => setInitialized(true));

  return initialized ? state : defaultState;
};

export const useSSRSafeSelector = <TData, TStore extends () => TData>(
  selector: TStore, defaultState: TData) => {
  const [initialized, setInitialized] = useState(false);
  const state = selector();

  useEffectOnceWhen(() => setInitialized(true));

  return initialized ? state : defaultState;
};
