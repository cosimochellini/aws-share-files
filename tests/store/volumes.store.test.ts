import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VolumeInfo } from '../../src/types/content.types';

vi.mock('../../src/instances/functions', () => ({
  functions: {
    content: {
      findFirst: vi.fn(),
    },
  },
}));

const LS_KEY = 'LS_VOLUMES';

interface PersistedVolumesState {
  volume?: VolumeInfo;
  volumeLoading?: boolean;
  cachedVolumes?: Record<string, VolumeInfo>;
}

const buildVolume = (title: string) => ({
  title,
  authors: ['Someone'],
  publishedDate: '2020-01-01',
  language: 'en',
} as unknown as VolumeInfo);

const seed = (state: PersistedVolumesState) => {
  window.localStorage.setItem(LS_KEY, JSON.stringify({ state, version: 0 }));
};

const readPersisted = (): PersistedVolumesState => {
  const raw = window.localStorage.getItem(LS_KEY);

  if (!raw) return {};

  const parsed = JSON.parse(raw) as { state: PersistedVolumesState };

  return parsed.state;
};

/**
 * volumes.store keeps its zustand store private, so the only way to start from a
 * known state is to rebuild the module and let `persist` rehydrate the seed.
 */
const loadStore = async () => {
  vi.resetModules();

  const functionsModule = await import('../../src/instances/functions');
  const notificationModule = await import('../../src/instances/notification');
  const storeModule = await import('../../src/store/volumes.store');

  return {
    findFirst: vi.mocked(functionsModule.functions.content.findFirst),
    notification: notificationModule.notification,
    ...storeModule,
  };
};

describe('volumes.store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('useVolumeGetter', () => {
    it('returns early while another volume is loading', async () => {
      seed({ volumeLoading: true, cachedVolumes: {} });

      const { findFirst, useVolumeGetter } = await loadStore();

      const snapshot = window.localStorage.getItem(LS_KEY);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('anything');
      });

      expect(findFirst).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(LS_KEY)).toBe(snapshot);
      expect(result.current.volume).toBeUndefined();
    });

    it('returns early when the cached volume is already the current one', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      const fetched = buildVolume('Dune');

      findFirst.mockResolvedValue(fetched);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('dune');
      });

      expect(findFirst).toHaveBeenCalledTimes(1);
      expect(result.current.volume).toBe(fetched);

      // the cache now holds the very same object as `volume`, so the second call bails out
      await act(async () => {
        await result.current.getVolume('dune');
      });

      expect(findFirst).toHaveBeenCalledTimes(1);
      expect(result.current.volume).toBe(fetched);
    });

    it('serves a cache hit without fetching when it differs from the current volume', async () => {
      const current = buildVolume('Current');
      const cached = buildVolume('Cached');

      seed({ volume: current, volumeLoading: false, cachedVolumes: { cached } });

      const { findFirst, useVolumeGetter } = await loadStore();

      const { result } = renderHook(() => useVolumeGetter());

      expect(result.current.volume).toEqual(current);

      await act(async () => {
        await result.current.getVolume('cached');
      });

      expect(findFirst).not.toHaveBeenCalled();
      expect(result.current.volume).toEqual(cached);
      expect(readPersisted().volume).toEqual(cached);
    });

    it('fetches on a cache miss and caches the result', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      const fetched = buildVolume('Fetched');

      findFirst.mockResolvedValue(fetched);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('fetched');
      });

      expect(findFirst).toHaveBeenCalledWith('fetched');
      expect(result.current.volume).toBe(fetched);

      const persisted = readPersisted();

      expect(persisted.volumeLoading).toBe(false);
      expect(persisted.cachedVolumes).toEqual({ fetched });
    });

    it('keeps the previously cached volumes when caching a new one', async () => {
      const cached = buildVolume('Cached');

      seed({ volumeLoading: false, cachedVolumes: { cached } });

      const { findFirst, useVolumeGetter } = await loadStore();

      const fetched = buildVolume('Fetched');

      findFirst.mockResolvedValue(fetched);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('fetched');
      });

      expect(readPersisted().cachedVolumes).toEqual({ cached, fetched });
    });

    it('leaves the store loading forever when the fetch resolves falsy', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      findFirst.mockResolvedValue(undefined);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('missing');
      });

      expect(findFirst).toHaveBeenCalledTimes(1);
      expect(result.current.volume).toBeUndefined();

      const persisted = readPersisted();

      expect(persisted.cachedVolumes).toEqual({});
      // KNOWN BUG: `volumeLoading` is only reset inside the `if (fetchedVolume)` branch,
      // so an empty result leaves the store stuck in the loading state and every later
      // getVolume() call returns early.
      expect(persisted.volumeLoading).toBe(true);

      await act(async () => {
        await result.current.getVolume('another');
      });

      expect(findFirst).toHaveBeenCalledTimes(1);
    });

    it('notifies and stays loading when the fetch rejects', async () => {
      const { findFirst, notification, useVolumeGetter } = await loadStore();

      const error = new Error('content api is down');
      const errorSpy = vi.spyOn(notification, 'error');

      findFirst.mockRejectedValue(error);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('boom');
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(result.current.volume).toBeUndefined();
      // KNOWN BUG: same stuck-loading branch as above, the catch swallows the error and
      // `volumeLoading` is never restored to false.
      expect(readPersisted().volumeLoading).toBe(true);
    });
  });
});
