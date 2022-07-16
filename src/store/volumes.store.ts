import create from "zustand";
import { Nullable } from "../types/generic";
import { VolumeInfo } from "../types/content.types";
import { functions } from "../instances/functions";
import { notification } from "../instances/notification";

interface VolumesState {
  volume: Nullable<VolumeInfo>;
  getVolume: (name: string) => Promise<void>;
  _cachedVolumes: Map<string, VolumeInfo>;
  _cachedVolumesLoading: boolean;
}

export const useVolumesStore = create<VolumesState>((set, get) => ({
  volume: null,
  _cachedVolumes: new Map<string, VolumeInfo>(),
  _cachedVolumesLoading: false,

  async getVolume(name: string) {
    const { _cachedVolumes, _cachedVolumesLoading, volume } = get();

    if (_cachedVolumesLoading) return;

    const cachedVolume = _cachedVolumes.get(name);

    if (cachedVolume === volume) return;

    if (cachedVolume) return set({ volume: cachedVolume });

    set({ _cachedVolumesLoading: true, volume: null });

    const fetchedVolume = await functions.content
      .findFirst(name)
      .catch(notification.error);

    if (fetchedVolume) {
      _cachedVolumes.set(name, fetchedVolume);
      set({ volume: fetchedVolume, _cachedVolumesLoading: false });
    }
  },
}));
