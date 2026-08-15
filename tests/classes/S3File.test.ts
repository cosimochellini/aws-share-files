import type { _Object } from '@aws-sdk/client-s3';
import { describe, expect, it } from 'vitest';

import { S3File } from '../../src/classes/S3File';

const lastModified = new Date('2024-03-05T10:00:00.000Z');

describe('S3File', () => {
  it('maps a complete S3 object', () => {
    const file = new S3File({
      Key: 'author/book.pdf',
      LastModified: lastModified,
      Size: 2048,
    } as _Object);

    expect(file.Key).toBe('author/book.pdf');
    expect(file.LastModified).toBe(lastModified);
    expect(file.FileInfo.CompleteName).toBe('book.pdf');
    expect(file.FileInfo.Extension).toBe('pdf');
    expect(file.Parent).toBe('author');
    expect(file.FileSize).toBe(2048);
    expect(file.FileName).toBe('book');
  });

  it('defaults a missing Size to 0', () => {
    const file = new S3File({ Key: 'author/book.pdf' } as _Object);

    expect(file.FileSize).toBe(0);
  });

  it('keeps a Size of 0 as 0', () => {
    const file = new S3File({ Key: 'author/book.pdf', Size: 0 } as _Object);

    expect(file.FileSize).toBe(0);
  });

  it('leaves a missing LastModified undefined', () => {
    const file = new S3File({ Key: 'author/book.pdf', Size: 1 } as _Object);

    expect(file.LastModified).toBeUndefined();
  });

  it('throws when the Key is missing, because it defaults to an empty string', () => {
    expect(() => new S3File({} as _Object)).toThrow(Error);
  });

  it('throws when the Key has no parent folder', () => {
    expect(() => new S3File({ Key: 'book.pdf' } as _Object)).toThrow(Error);
  });
});
