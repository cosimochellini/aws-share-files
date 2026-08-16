import type { Fields, Files } from 'formidable';
import type { NextApiRequest } from 'next';
import { promises as fs } from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fileHandler } from '../../../src/utils/api/fileHandler';

type ParseCallback = (err: unknown, fields: Fields, files: Files) => void;

const mocks = vi.hoisted(() => ({
  parse: vi.fn<(req: unknown, callback: unknown) => void>(),
  incomingForm: vi.fn(),
}));

vi.mock('formidable', () => ({
  IncomingForm: mocks.incomingForm,
}));

vi.mock('fs', () => {
  const promises = { readFile: vi.fn() };

  return { promises, default: { promises } };
});

const readFileMock = vi.mocked(fs.readFile);

const req = {} as NextApiRequest;

const asFields = (fields: Record<string, unknown>) => fields as unknown as Fields;
const asFiles = (files: Record<string, unknown>) => files as unknown as Files;

const resolveParseWith = (fields: Record<string, unknown>, files: Record<string, unknown>) => {
  mocks.parse.mockImplementation((_req, callback) => {
    (callback as ParseCallback)(null, asFields(fields), asFiles(files));
  });
};

beforeEach(() => {
  // fileHandler calls `new IncomingForm(...)`, and Vitest 4 refuses to construct an
  // arrow function. A function expression returning an object still overrides `this`,
  // so the fake parser comes back from `new` exactly as before.
  mocks.incomingForm.mockImplementation(function IncomingFormMock() {
    return { parse: mocks.parse };
  });
});

describe('fileHandler', () => {
  it('constructs the parser with multiples disabled', async () => {
    resolveParseWith({}, {});

    await fileHandler(req);

    expect(mocks.incomingForm).toHaveBeenCalledWith({ multiples: false });
    expect(mocks.parse).toHaveBeenCalledTimes(1);
  });

  it('resolves the parsed form and exposes the fields as the body', async () => {
    resolveParseWith({ folder: 'author', title: 'book' }, { file: { filepath: '/tmp/a' } });

    const handler = await fileHandler<{ folder: string; title: string }>(req);

    expect(handler.form.fields).toEqual({ folder: 'author', title: 'book' });
    expect(handler.form.files).toEqual({ file: { filepath: '/tmp/a' } });
    expect(handler.body).toEqual({ folder: 'author', title: 'book' });
  });

  it('rejects when the parser reports an error', async () => {
    mocks.parse.mockImplementation((_req, callback) => {
      (callback as ParseCallback)(new Error('parse failed'), asFields({}), asFiles({}));
    });

    await expect(fileHandler(req)).rejects.toThrow('parse failed');
  });

  describe('getFile', () => {
    it('reads the filepath of the first file field', async () => {
      resolveParseWith({}, { upload: { filepath: '/tmp/upload.pdf' } });
      readFileMock.mockResolvedValue(Buffer.from('contents'));

      const handler = await fileHandler(req);
      const content = await handler.getFile();

      expect(readFileMock).toHaveBeenCalledWith('/tmp/upload.pdf');
      expect(content.toString()).toBe('contents');
    });

    it('uses the first element when the entry is an array', async () => {
      resolveParseWith({}, {
        upload: [{ filepath: '/tmp/first.pdf' }, { filepath: '/tmp/second.pdf' }],
      });
      readFileMock.mockResolvedValue(Buffer.from('first'));

      const handler = await fileHandler(req);
      await handler.getFile();

      expect(readFileMock).toHaveBeenCalledWith('/tmp/first.pdf');
    });

    it('throws when there is no file field at all', async () => {
      resolveParseWith({ folder: 'author' }, {});

      const handler = await fileHandler(req);

      await expect(handler.getFile()).rejects.toThrow('file is undefined');
      expect(readFileMock).not.toHaveBeenCalled();
    });

    it('throws when the file entry is present but falsy', async () => {
      resolveParseWith({}, { upload: undefined });

      const handler = await fileHandler(req);

      await expect(handler.getFile()).rejects.toThrow('file is undefined');
    });

    it('throws when the file entry is an empty array', async () => {
      resolveParseWith({}, { upload: [] });

      const handler = await fileHandler(req);

      await expect(handler.getFile()).rejects.toThrow('file is undefined');
    });

    it('throws when the file has no filepath', async () => {
      resolveParseWith({}, { upload: { originalFilename: 'book.pdf' } });

      const handler = await fileHandler(req);

      await expect(handler.getFile()).rejects.toThrow('file has no filepath');
    });
  });
});
