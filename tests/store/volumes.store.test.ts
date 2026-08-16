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

    it('drops the displayed volume while another lookup is loading', async () => {
      const current = buildVolume('Current');

      seed({ volume: current, volumeLoading: true, cachedVolumes: {} });

      const { findFirst, useVolumeGetter } = await loadStore();

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('anything');
      });

      // the in-flight lookup is for some other name, so its predecessor must not be shown
      expect(findFirst).not.toHaveBeenCalled();
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

    it('clears the loading flag when the fetch resolves falsy, so later lookups still run', async () => {
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
      expect(persisted.volumeLoading).toBe(false);

      // a different name is looked up again, the loading flag no longer wedges the store
      await act(async () => {
        await result.current.getVolume('another');
      });

      expect(findFirst).toHaveBeenCalledTimes(2);
      expect(findFirst).toHaveBeenNthCalledWith(2, 'another');
      expect(readPersisted().volumeLoading).toBe(false);
    });

    it('does not look the same missing name up twice', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      findFirst.mockResolvedValue(undefined);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('missing');
      });

      await act(async () => {
        await result.current.getVolume('missing');
      });

      expect(findFirst).toHaveBeenCalledTimes(1);
      // the second call bails out on the remembered miss, not on a wedged loading flag
      expect(readPersisted().volumeLoading).toBe(false);
    });

    it('drops the previous volume when a remembered missing name is asked for again', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      const fetched = buildVolume('Fetched');

      findFirst.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('missing');
      });

      findFirst.mockResolvedValueOnce(fetched);

      await act(async () => {
        await result.current.getVolume('fetched');
      });

      expect(result.current.volume).toBe(fetched);

      await act(async () => {
        await result.current.getVolume('missing');
      });

      expect(findFirst).toHaveBeenCalledTimes(2);
      expect(result.current.volume).toBeUndefined();
    });

    it('does not retry a name whose lookup failed', async () => {
      const { findFirst, notification, useVolumeGetter } = await loadStore();

      const errorSpy = vi.spyOn(notification, 'error');

      findFirst.mockRejectedValue(new Error('content api is down'));

      const { result } = renderHook(() => useVolumeGetter());

      await act(async () => {
        await result.current.getVolume('boom');
      });

      await act(async () => {
        await result.current.getVolume('boom');
      });

      // a failed lookup is remembered like a miss, so callers re-running on every store
      // update cannot turn an outage into a request storm
      expect(findFirst).toHaveBeenCalledTimes(1);
      // and the retry is silent: the failure was already reported once
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('drops a lookup that resolves after another name was asked for', async () => {
      const { findFirst, useVolumeGetter } = await loadStore();

      const slow = buildVolume('Slow');

      let resolveSlow: (volume: typeof slow) => void = () => {};

      findFirst.mockReturnValueOnce(new Promise((resolve) => {
        resolveSlow = resolve;
      }));

      const { result } = renderHook(() => useVolumeGetter());

      let pending: Promise<void> = Promise.resolve();

      await act(async () => {
        pending = result.current.getVolume('slow');
      });

      // the modal moved on to another file while the first lookup was still in flight
      await act(async () => {
        await result.current.getVolume('other');
      });

      await act(async () => {
        resolveSlow(slow);
        await pending;
      });

      expect(result.current.volume).toBeUndefined();
      expect(readPersisted().cachedVolumes).toEqual({});
      expect(readPersisted().volumeLoading).toBe(false);
    });

    it('notifies and clears the loading flag when the fetch rejects', async () => {
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
      expect(readPersisted().volumeLoading).toBe(false);
    });
  });
});
