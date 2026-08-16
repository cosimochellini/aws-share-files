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

const useStore = create(persist<VolumesState>(() => defaultState, { name: 'LS_VOLUMES' }));

// names the content API has no volume for: retrying them would loop, since callers
// re-run getVolume on every store update
const missingVolumes = new Set<string>();

export const useVolumeGetter = () => {
  const state = useStore();

  const { volume } = state;
  const getVolume = useCallback(async (name: string) => {
    const set = useStore.setState;

    if (state.volumeLoading) return;

    if (missingVolumes.has(name)) {
      // still drop whatever the previous lookup found, or it would be shown for this name
      if (state.volume) set({ volume: undefined });

      return;
    }

    const cachedVolume = state.cachedVolumes[name];

    if (cachedVolume && cachedVolume === state.volume) return;

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

    if (!fetchedVolume) {
      missingVolumes.add(name);

      set({ volumeLoading: false });
      return;
    }

    set({
      volume: fetchedVolume,
      volumeLoading: false,
      cachedVolumes: {
        ...state.cachedVolumes,
        [name]: fetchedVolume,
      },
    });
  }, [state]);

  return {
    volume,
    getVolume,
  };
};
