import { create } from 'zustand';

import type { S3Folder } from '../classes/S3Folder';
import { functions } from '../instances/functions';
import { notification } from '../instances/notification';

export interface FilesState {
  folders: S3Folder[] | undefined;

  loading: boolean;

  loadFolders: (force?: boolean) => Promise<void>;

  refreshFolders: (reset?: boolean) => Promise<void>;
}

export const useFolderStore = create<FilesState>((set, get) => ({
  folders: undefined,
  loading: false,

  async loadFolders(force = false) {
    const { folders, loading } = get();

    if ((folders?.length || loading) && !force) return;

    set({ loading: true });

    await functions.s3
      .files()
      .then((folders) => set({ folders }))
      .catch(notification.error)
      .finally(() => set({ loading: false }));
  },

  async refreshFolders(reset = false) {
    const { loadFolders } = get();

    if (reset) set({ folders: undefined });

    await loadFolders(true);
  },
}));
