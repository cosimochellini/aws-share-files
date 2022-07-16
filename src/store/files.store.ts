import create from "zustand";
import { S3Folder } from "../classes/S3Folder";
import { functions } from "../instances/functions";
import { notification } from "../instances/notification";

export interface FilesState {
  folders: S3Folder[] | undefined;

  loading: boolean;

  _subscriptions: (() => void)[];
  _subscriptionsFired: boolean;

  loadFolders: (force?: boolean) => Promise<void>;

  refreshFolders: (reset?: boolean) => Promise<void>;

  subscribeOnDataLoaded: (callback: () => void) => void;
}

export const useFolderStore = create<FilesState>((set, get) => ({
  folders: undefined,
  loading: false,

  _subscriptions: [],
  _subscriptionsFired: false,

  loadFolders: async (force = false) => {
    const { folders, loading } = get();

    if ((folders?.length || loading) && !force) return;

    set({ loading: true });

    await functions.s3
      .files()
      .then((folders) => {
        set({ folders });

        const { _subscriptions, _subscriptionsFired } = get();

        if (!_subscriptionsFired) {
          _subscriptions.forEach((callback) => callback());
          set({ _subscriptionsFired: true });
        }
      })
      .catch(notification.error)
      .finally(() => set({ loading: false }));
  },

  refreshFolders: async (reset = false) => {
    const { loadFolders } = get();

    if (reset) set({ folders: undefined });

    await loadFolders(true);
  },

  subscribeOnDataLoaded: (callback: () => void) => {
    const { _subscriptions } = get();

    _subscriptions.push(callback);
  },
}));
