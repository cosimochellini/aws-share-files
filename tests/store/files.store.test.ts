import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { S3Folder } from '../../src/classes/S3Folder';
import type { FilesState } from '../../src/store/files.store';

vi.mock('../../src/instances/functions', () => ({
  functions: {
    s3: {
      files: vi.fn(),
    },
  },
}));

const LS_KEY = 'LS_FILES';

const buildFolder = (name: string) => ({
  FolderName: name,
  Key: `${name}/file.pdf`,
  Files: [],
} as unknown as S3Folder);

const seed = (state: Partial<FilesState>) => {
  window.localStorage.setItem(LS_KEY, JSON.stringify({ state, version: 0 }));
};

const readPersisted = (): Partial<FilesState> => {
  const raw = window.localStorage.getItem(LS_KEY);

  if (!raw) return {};

  const parsed = JSON.parse(raw) as { state: Partial<FilesState> };

  return parsed.state;
};

/**
 * files.store is a module singleton built on zustand `persist`, and it exposes no
 * handle to reset itself. Re-importing the module after `vi.resetModules()` rebuilds
 * the store, rehydrating whatever `seed()` left in localStorage.
 */
const loadStore = async () => {
  vi.resetModules();

  const functionsModule = await import('../../src/instances/functions');
  const notificationModule = await import('../../src/instances/notification');
  const storeModule = await import('../../src/store/files.store');

  return {
    files: vi.mocked(functionsModule.functions.s3.files),
    notification: notificationModule.notification,
    ...storeModule,
  };
};

describe('files.store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('useLoadFolders', () => {
    it('fetches the folders and marks the store initialized', async () => {
      const { files, useLoadFolders } = await loadStore();

      const folders = [buildFolder('docs'), buildFolder('books')];

      files.mockResolvedValue(folders);

      const { result } = renderHook(() => useLoadFolders());

      await act(async () => {
        await result.current();
      });

      expect(files).toHaveBeenCalledTimes(1);
      expect(readPersisted().folders).toEqual(folders);
      expect(readPersisted().initialized).toBe(true);
    });

    it('does not fetch again once initialized', async () => {
      seed({ folders: [buildFolder('docs')], initialized: true });

      const { files, useLoadFolders } = await loadStore();

      files.mockResolvedValue([]);

      const { result } = renderHook(() => useLoadFolders());

      await act(async () => {
        await result.current();
      });

      expect(files).not.toHaveBeenCalled();
    });

    it('fetches again when forced', async () => {
      seed({ folders: [buildFolder('stale')], initialized: true });

      const { files, useLoadFolders } = await loadStore();

      const fresh = [buildFolder('fresh')];

      files.mockResolvedValue(fresh);

      const { result } = renderHook(() => useLoadFolders());

      await act(async () => {
        await result.current(true);
      });

      expect(files).toHaveBeenCalledTimes(1);
      expect(readPersisted().folders).toEqual(fresh);
    });

    it('notifies on a rejected fetch and still marks the store initialized', async () => {
      const { files, notification, useLoadFolders } = await loadStore();

      const error = new Error('s3 is down');
      const errorSpy = vi.spyOn(notification, 'error');

      files.mockRejectedValue(error);

      const { result } = renderHook(() => useLoadFolders());

      await act(async () => {
        await result.current();
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(readPersisted().folders).toEqual([]);
      expect(readPersisted().initialized).toBe(true);
    });
  });

  describe('useRefreshFolders', () => {
    it('refetches without clearing the current folders', async () => {
      const stale = buildFolder('stale');

      seed({ folders: [stale], initialized: true });

      const { files, useRefreshFolders } = await loadStore();

      const fresh = [buildFolder('fresh')];

      let foldersDuringFetch: Partial<FilesState>['folders'] = [];

      files.mockImplementation(async () => {
        foldersDuringFetch = readPersisted().folders;
        return fresh;
      });

      const { result } = renderHook(() => useRefreshFolders());

      await act(async () => {
        await result.current();
      });

      expect(foldersDuringFetch).toEqual([stale]);
      expect(readPersisted().folders).toEqual(fresh);
    });

    it('clears the folders first when forced', async () => {
      const stale = buildFolder('stale');

      seed({ folders: [stale], initialized: true });

      const { files, useRefreshFolders } = await loadStore();

      const fresh = [buildFolder('fresh')];

      let foldersDuringFetch: Partial<FilesState>['folders'] = [stale];

      files.mockImplementation(async () => {
        foldersDuringFetch = readPersisted().folders;
        return fresh;
      });

      const { result } = renderHook(() => useRefreshFolders());

      await act(async () => {
        await result.current(true);
      });

      expect(foldersDuringFetch).toEqual([]);
      expect(readPersisted().folders).toEqual(fresh);
    });
  });

  describe('useFolders', () => {
    it('returns the default state on the first render, then the real state', async () => {
      const persistedFolder = buildFolder('persisted');

      seed({ folders: [persistedFolder], initialized: true });

      const { files, useFolders } = await loadStore();

      files.mockResolvedValue([]);

      const renders: FilesState[] = [];

      const { result } = renderHook(() => {
        const state = useFolders();

        renders.push(state);

        return state;
      });

      // the SSR-safe selector hands back the default state until the effects flush
      expect(renders[0]).toEqual({ folders: [], initialized: false });

      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });

      expect(result.current.folders).toHaveLength(1);
      expect(files).not.toHaveBeenCalled();
    });

    it('triggers a load when the store has never been initialized', async () => {
      const { files, useFolders } = await loadStore();

      const folders = [buildFolder('docs')];

      files.mockResolvedValue(folders);

      const { result } = renderHook(() => useFolders());

      await waitFor(() => {
        expect(files).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(result.current.initialized).toBe(true);
      });

      expect(result.current.folders).toEqual(folders);
    });
  });
});
