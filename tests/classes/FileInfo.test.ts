import { describe, expect, it } from 'vitest';

import { FileInfo } from '../../src/classes/FileInfo';

describe('FileInfo', () => {
  it('splits a "parent/file.ext" key into its parts', () => {
    const info = new FileInfo('author/book.pdf');

    expect(info.Parent).toBe('author');
    expect(info.CompleteName).toBe('book.pdf');
    expect(info.Name).toBe('book');
    expect(info.Extension).toBe('pdf');
  });

  it('keeps only the first two segments of a multi-dot file name', () => {
    const info = new FileInfo('a/b.tar.gz');

    expect(info.Name).toBe('b');
    expect(info.Extension).toBe('tar');
    expect(info.CompleteName).toBe('b.tar.gz');
  });

  it('leaves the extension undefined when the file name has no dot', () => {
    const info = new FileInfo('author/README');

    expect(info.Name).toBe('README');
    expect(info.Extension).toBeUndefined();
  });

  it('ignores anything after the second slash', () => {
    const info = new FileInfo('author/book.pdf/extra');

    expect(info.Parent).toBe('author');
    expect(info.CompleteName).toBe('book.pdf');
  });

  it('throws when there is no slash at all', () => {
    expect(() => new FileInfo('book.pdf')).toThrow(Error);
  });

  it('throws when the parent is empty', () => {
    expect(() => new FileInfo('/book.pdf')).toThrow(Error);
  });

  it('throws when there is no file name', () => {
    expect(() => new FileInfo('author/')).toThrow(Error);
  });

  it('throws for an empty key', () => {
    expect(() => new FileInfo('')).toThrow(Error);
  });
});
