import { beforeEach, describe, expect, it, vi } from 'vitest';

import { content } from '../../src/services/content.service';
import { notification } from '../../src/instances/notification';
import type { ContentResponse, VolumeInfo } from '../../src/types/content.types';

const fetchMock = vi.fn();

const volumeInfo = (title: string) => ({ title } as VolumeInfo);

const respondWith = (payload: unknown) => {
  fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) });
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
  const networkError = new Error('network down');

  beforeEach(() => {
    fetchMock.mockRejectedValue(networkError);
    vi.spyOn(notification, 'error').mockImplementation(() => {});
  });

  it('reports the failure to notification.error and rethrows the original error', async () => {
    await expect(content.findFirstContent('dune')).rejects.toBe(networkError);

    expect(notification.error).toHaveBeenCalledWith(networkError);
  });

  it('behaves identically for findAllContent', async () => {
    await expect(content.findAllContent('dune')).rejects.toBe(networkError);

    expect(notification.error).toHaveBeenCalledWith(networkError);
  });

  it('rethrows a json() parse failure the same way', async () => {
    const parseError = new Error('invalid json');

    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.reject(parseError) });

    await expect(content.findAllContent('dune')).rejects.toBe(parseError);

    expect(notification.error).toHaveBeenCalledWith(parseError);
  });

  it('reports an error status instead of parsing the error body as a result', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve({}) });

    await expect(content.findFirstContent('dune'))
      .rejects.toThrowError('the content API answered /volumes with 429');

    expect(notification.error).toHaveBeenCalledTimes(1);
  });
});
