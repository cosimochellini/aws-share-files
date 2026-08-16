import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback } from 'react';

import type { Nullable } from '../types/generic';
import type { VolumeInfo } from '../types/content.types';
import { functions } from '../instances/functions';
import { notification } from '../instances/notification';

interface VolumesState {
  volume: Nullable<VolumeInfo>;
  volumeLoading: boolean;
  cachedVolumes: Record<string, VolumeInfo>;
}

const defaultState: VolumesState = {
  volume: undefined,
  volumeLoading: false,
  cachedVolumes: {},
};

type PersistedVolumesState = Pick<VolumesState, 'cachedVolumes'>;

const useStore = create(persist<VolumesState, [], [], PersistedVolumesState>(
  () => defaultState,
  {
    name: 'LS_VOLUMES',
    // only the cache is worth keeping: persisting `volumeLoading` means a reload during a
    // lookup rehydrates a loading flag no running promise will ever clear, wedging the
    // store for good. `volume` is just as transient.
    partialize: (state) => ({ cachedVolumes: state.cachedVolumes }),
    merge: (persisted, current) => ({
      ...current,
      cachedVolumes: (persisted as PersistedVolumesState | undefined)?.cachedVolumes ?? {},
    }),
  },
));

// both of these are module scope, like the store itself, so they assume a single consumer
// of useVolumeGetter at a time - which is how FileModal, the only one, uses it.
//
// names the content API has no volume for: retrying them would loop, since callers
// re-run getVolume on every store update
const missingVolumes = new Set<string>();

// the name asked for most recently, so a lookup that resolves after the caller moved on
// cannot publish its volume under someone else's name
let requestedName: string | undefined;

export const useVolumeGetter = () => {
  const state = useStore();

  const { volume } = state;
  const getVolume = useCallback(async (name: string) => {
    const set = useStore.setState;
    const get = useStore.getState;

    requestedName = name;

    // read the live store, not the snapshot this callback closed over, or two calls made
    // within one render would both pass the guards below
    const current = get();

    // a lookup already in flight has cleared `volume` itself, so there is nothing stale
    // left to drop here
    if (current.volumeLoading) return;

    if (missingVolumes.has(name)) {
      // still drop whatever the previous lookup found, or it would be shown for this name
      if (current.volume) set({ volume: undefined });

      return;
    }

    const cachedVolume = current.cachedVolumes[name];

    if (cachedVolume && cachedVolume === current.volume) return;

    if (cachedVolume) {
      set({ volume: cachedVolume });
      return;
    }

    set({
      volume: undefined,
      volumeLoading: true,
    });

    const fetchedVolume = await functions.content
      .findFirst(name)
      .catch(notification.error);

    if (requestedName !== name) {
      // a newer lookup was asked for while this one was in flight: drop this result and
      // release the flag so that one can run
      set({ volumeLoading: false });
      return;
    }

    if (!fetchedVolume) {
      missingVolumes.add(name);

      set({ volumeLoading: false });
      return;
    }

    set({
      volume: fetchedVolume,
      volumeLoading: false,
      cachedVolumes: {
        ...get().cachedVolumes,
        [name]: fetchedVolume,
      },
    });
    // `state` is not read inside - the guards deliberately read the live store - but it is
    // kept as a dependency so callers that re-run this on identity change get another go
    // once a lookup they were bounced from has finished
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    volume,
    getVolume,
  };
};
