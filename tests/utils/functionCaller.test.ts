import type { Mock } from 'vitest';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

import { caller } from '../../src/utils/functionCaller';

type FetchMock = (input: string, init?: RequestInit) => Promise<Response>;

const respondWith = (ok: boolean, payload: unknown) => ({
  ok,
  json: () => Promise.resolve(payload),
}) as unknown as Response;

let fetchMock: Mock<FetchMock>;

beforeEach(() => {
  fetchMock = vi.fn<FetchMock>();
  vi.stubGlobal('fetch', fetchMock);
});

const lastInit = () => fetchMock.mock.calls[0]?.[1];

describe('caller', () => {
  it('builds the /api url with the serialised query string', async () => {
    fetchMock.mockResolvedValue(respondWith(true, { ok: 1 }));

    await caller('files', { folder: 'author', page: '2' });

    expect(fetchMock).toHaveBeenCalledWith('/api/files?folder=author&page=2');
  });

  it('defaults the query to an empty object', async () => {
    fetchMock.mockResolvedValue(respondWith(true, {}));

    await caller('files');

    expect(fetchMock).toHaveBeenCalledWith('/api/files?');
  });

  it('encodes query values', async () => {
    fetchMock.mockResolvedValue(respondWith(true, {}));

    await caller('files', { folder: 'a b&c' });

    expect(fetchMock).toHaveBeenCalledWith('/api/files?folder=a+b%26c');
  });

  it('resolves with the parsed body when the response is ok', async () => {
    fetchMock.mockResolvedValue(respondWith(true, { files: ['a'] }));

    await expect(caller<{ files: string[] }>('files')).resolves.toEqual({ files: ['a'] });
  });

  it('rejects with the parsed body when the response is not ok', async () => {
    fetchMock.mockResolvedValue(respondWith(false, { error: 'nope' }));

    await expect(caller('files')).rejects.toEqual({ error: 'nope' });
  });
});

describe('caller.post', () => {
  it('posts a JSON body with the JSON content type header', async () => {
    fetchMock.mockResolvedValue(respondWith(true, { done: true }));

    await caller.post('share', { to: 'someone@example.test' });

    expect(fetchMock).toHaveBeenCalledWith('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'someone@example.test' }),
    });
  });

  it('defaults the body to an empty object', async () => {
    fetchMock.mockResolvedValue(respondWith(true, {}));

    await caller.post('share');

    expect(lastInit()?.body).toBe('{}');
  });

  it('resolves with the parsed body when the response is ok', async () => {
    fetchMock.mockResolvedValue(respondWith(true, { id: 7 }));

    await expect(caller.post<{ id: number }>('share')).resolves.toEqual({ id: 7 });
  });

  it('rejects with the parsed body when the response is not ok', async () => {
    fetchMock.mockResolvedValue(respondWith(false, { error: 'bad request' }));

    await expect(caller.post('share')).rejects.toEqual({ error: 'bad request' });
  });
});

describe('caller.formData', () => {
  it('appends a File directly and stringifies everything else', async () => {
    fetchMock.mockResolvedValue(respondWith(true, { uploaded: true }));

    const file = new File(['content'], 'book.pdf', { type: 'application/pdf' });

    await caller.formData('upload', { file, folder: 'author', count: 3 });

    const init = lastInit();
    const { body } = init ?? {};

    expect(init?.method).toBe('POST');
    expect(body).toBeInstanceOf(FormData);

    if (!(body instanceof FormData)) throw new Error('expected a FormData body');

    const stored = body.get('file');

    expect(stored).toBeInstanceOf(File);

    if (!(stored instanceof File)) throw new Error('expected a File entry');

    expect(stored.name).toBe('book.pdf');
    expect(stored.type).toBe('application/pdf');
    expect(body.get('folder')).toBe('author');
    expect(body.get('count')).toBe('3');
  });

  it('does not set a Content-Type header, letting the browser add the boundary', async () => {
    fetchMock.mockResolvedValue(respondWith(true, {}));

    await caller.formData('upload', { folder: 'author' });

    expect(lastInit()?.headers).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/api/upload', expect.objectContaining({ method: 'POST' }));
  });

  it('defaults the form to an empty object', async () => {
    fetchMock.mockResolvedValue(respondWith(true, {}));

    await caller.formData('upload');

    const { body } = lastInit() ?? {};

    if (!(body instanceof FormData)) throw new Error('expected a FormData body');

    expect(Array.from(body.keys())).toEqual([]);
  });

  it('rejects with the parsed body when the response is not ok', async () => {
    fetchMock.mockResolvedValue(respondWith(false, { error: 'too large' }));

    await expect(caller.formData('upload')).rejects.toEqual({ error: 'too large' });
  });
});
