import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { S3Folder } from '../classes/S3Folder';
import { functions } from '../instances/functions';
import { notification } from '../instances/notification';
import { useEffectOnceWhen } from '../hooks/once';
import { useSSRSafeSelector } from '../hooks/ssr.hook';

export interface FilesState {
  folders: S3Folder[];
  initialized: boolean;
}

const defaultState: FilesState = {
  folders: [],
  initialized: false,
};

const useStore = create(persist<FilesState>(() => defaultState, {
  name: 'LS_FILES',
}));

export const useFolders = () => {
  const state = useSSRSafeSelector(useStore, defaultState);

  const loadFolders = useLoadFolders();

  useEffectOnceWhen(loadFolders, !state.initialized);

  return state;
};

export const useLoadFolders = () => {
  const initialized = useStore((x) => x.initialized);
  const set = useStore.setState;

  return async (force = false) => {
    if (initialized && !force) return;

    await functions.s3
      .files()
      .then((folders) => set({ folders }))
      .catch(notification.error)
      .finally(() => set({ initialized: true }));
  };
};

export const useRefreshFolders = () => {
  const set = useStore.setState;

  const loadFolders = useLoadFolders();

  return async (force = false) => {
    if (force) set({ folders: [] });

    await loadFolders(true);
  };
};
