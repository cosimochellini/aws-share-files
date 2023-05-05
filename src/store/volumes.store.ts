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

export const useVolumeGetter = () => {
  const state = useStore();

  const { volume } = state;
  const getVolume = useCallback(async (name: string) => {
    const set = useStore.setState;

    if (state.volumeLoading) return;

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

    if (fetchedVolume) {
      set({
        volume: fetchedVolume,
        volumeLoading: false,
        cachedVolumes: {
          ...state.cachedVolumes,
          [name]: fetchedVolume,
        },
      });
    }
  }, [state]);

  return {
    volume,
    getVolume,
  };
};
