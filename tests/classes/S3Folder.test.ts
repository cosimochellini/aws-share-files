import type { _Object } from '@aws-sdk/client-s3';
import { describe, expect, it } from 'vitest';

import { S3Folder } from '../../src/classes/S3Folder';

const firstModified = new Date('2024-01-01T00:00:00.000Z');
const secondModified = new Date('2024-06-01T00:00:00.000Z');

const object = (Key: string, extra: Partial<_Object> = {}): _Object => ({ Key, ...extra });

describe('S3Folder.Create', () => {
  it('returns an empty array for an empty input', () => {
    expect(S3Folder.Create([])).toEqual([]);
  });

  it('skips the keys that end with a slash', () => {
    expect(S3Folder.Create([object('author/')])).toEqual([]);
  });

  it('skips the items whose Key is undefined', () => {
    expect(S3Folder.Create([{} as _Object])).toEqual([]);
  });

  it('skips a key that has no folder segment', () => {
    expect(S3Folder.Create([object('/book.pdf')])).toEqual([]);
  });

  it('groups two files of the same folder into a single S3Folder', () => {
    const folders = S3Folder.Create([
      object('author/first.pdf', { Size: 10, LastModified: firstModified }),
      object('author/second.pdf', { Size: 20, LastModified: secondModified }),
    ]);

    expect(folders).toHaveLength(1);

    const [folder] = folders;

    expect(folder?.FolderName).toBe('author');
    expect(folder?.Files).toHaveLength(2);
    expect(folder?.Files.map((file) => file.FileName)).toEqual(['first', 'second']);
  });

  it('takes the folder Key and LastModified from its first file', () => {
    const [folder] = S3Folder.Create([
      object('author/first.pdf', { LastModified: firstModified }),
      object('author/second.pdf', { LastModified: secondModified }),
    ]);

    expect(folder?.Key).toBe('author/first.pdf');
    expect(folder?.LastModified).toBe(firstModified);
  });

  it('keeps one entry per folder, in insertion order', () => {
    const folders = S3Folder.Create([
      object('beta/one.pdf'),
      object('alpha/one.pdf'),
      object('beta/two.pdf'),
    ]);

    expect(folders.map((folder) => folder.FolderName)).toEqual(['beta', 'alpha']);
    expect(folders[0]?.Files).toHaveLength(2);
    expect(folders[1]?.Files).toHaveLength(1);
  });

  it('ignores the folder markers while still grouping the real files', () => {
    const folders = S3Folder.Create([
      object('author/'),
      object('author/book.pdf'),
    ]);

    expect(folders).toHaveLength(1);
    expect(folders[0]?.Files).toHaveLength(1);
  });
});

describe('S3Folder.withFile', () => {
  it('pushes the file and returns the same instance', () => {
    const folder = new S3Folder(object('author/book.pdf'));

    const returned = folder.withFile(object('author/other.pdf'));

    expect(returned).toBe(folder);
    expect(folder.Files).toHaveLength(1);
    expect(folder.Files[0]?.FileName).toBe('other');
  });

  it('derives the folder name from the key of the object it was built with', () => {
    const folder = new S3Folder(object('author/book.pdf'));

    expect(folder.FolderName).toBe('author');
    expect(folder.Files).toEqual([]);
  });
});
