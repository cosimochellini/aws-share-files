import { beforeEach, describe, expect, it, vi } from 'vitest';

import { content } from '../../src/services/content.service';
import { notification } from '../../src/instances/notification';
import type { ContentResponse, VolumeInfo } from '../../src/types/content.types';

const fetchMock = vi.fn();

const volumeInfo = (title: string) => ({ title } as VolumeInfo);

const respondWith = (payload: unknown) => {
  fetchMock.mockResolvedValue({ json: () => Promise.resolve(payload) });
};

const entry = (title: string) => ({ volumeInfo: volumeInfo(title) });

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  respondWith({ kind: 'books#volumes', totalItems: 0 } satisfies ContentResponse);
});

describe('content.findFirstContent', () => {
  it('queries the content API and returns the first volumeInfo', async () => {
    respondWith({ items: [entry('Dune'), entry('Neuromancer')] });

    await expect(content.findFirstContent('dune')).resolves.toEqual({ title: 'Dune' });

    expect(fetchMock).toHaveBeenCalledWith('https://content.example.test/volumes?q=dune');
  });

  it('url-encodes the query string', async () => {
    respondWith({ items: [entry('Harry Potter')] });

    await content.findFirstContent('harry potter & the goblet');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://content.example.test/volumes?q=harry+potter+%26+the+goblet',
    );
  });

  it('resolves undefined when the response carries no items', async () => {
    respondWith({ kind: 'books#volumes', totalItems: 0 });

    await expect(content.findFirstContent('nothing')).resolves.toBeUndefined();
  });

  it('resolves undefined when items is an empty array', async () => {
    respondWith({ items: [] });

    await expect(content.findFirstContent('nothing')).resolves.toBeUndefined();
  });
});

describe('content.findAllContent', () => {
  it('maps every entry to its volumeInfo', async () => {
    respondWith({ items: [entry('Dune'), entry('Neuromancer')] });

    await expect(content.findAllContent('sci-fi')).resolves.toEqual([
      { title: 'Dune' },
      { title: 'Neuromancer' },
    ]);

    expect(fetchMock).toHaveBeenCalledWith('https://content.example.test/volumes?q=sci-fi');
  });

  it('resolves an empty array when the response carries no items', async () => {
    respondWith({ kind: 'books#volumes', totalItems: 0 });

    await expect(content.findAllContent('nothing')).resolves.toEqual([]);
  });
});

describe('content API failures', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('network down'));
    vi.spyOn(notification, 'error').mockImplementation(() => {});
  });

  // KNOWN BUG: contentApiCaller ends with `.catch(notification.error)`, which swallows the
  // rejection and resolves with `undefined` instead of re-throwing. The callers then read
  // `.items` off that `undefined`, so the reported failure is a TypeError about `items`
  // rather than the original network error. Pinning the current behaviour.
  it('reports the failure to notification.error and then blows up reading .items', async () => {
    await expect(content.findFirstContent('dune')).rejects.toThrowError(TypeError);

    expect(notification.error).toHaveBeenCalledWith(new Error('network down'));
  });

  it('behaves identically for findAllContent', async () => {
    await expect(content.findAllContent('dune')).rejects.toThrowError(TypeError);

    expect(notification.error).toHaveBeenCalledWith(new Error('network down'));
  });

  it('also swallows a json() parse failure the same way', async () => {
    fetchMock.mockResolvedValue({ json: () => Promise.reject(new Error('invalid json')) });

    await expect(content.findAllContent('dune')).rejects.toThrowError(TypeError);

    expect(notification.error).toHaveBeenCalledWith(new Error('invalid json'));
  });
});
