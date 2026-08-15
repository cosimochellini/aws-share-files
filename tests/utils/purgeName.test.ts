import { describe, expect, it } from 'vitest';

import { purgeName } from '../../src/utils/purgeName';

// CONTENT_INVALID_WORDS is 'ita,eng,epub' (see tests/setup.ts).
describe('purgeName', () => {
  it('defaults the name to an empty string', () => {
    expect(purgeName()).toBe('');
  });

  it('returns an empty string for an empty name', () => {
    expect(purgeName('')).toBe('');
  });

  it('removes the extension', () => {
    expect(purgeName('book.pdf')).toBe('book');
  });

  it('keeps a name that has no extension', () => {
    expect(purgeName('book')).toBe('book');
  });

  it('only removes the last extension of a multi-dot name', () => {
    expect(purgeName('archive.tar.gz')).toBe('archive tar');
  });

  it('removes the invalid words case-insensitively', () => {
    expect(purgeName('book ITA.pdf')).toBe('book ');
  });

  it('removes every configured invalid word', () => {
    expect(purgeName('itaengepubtitle')).toBe('title');
  });

  it('removes an invalid word even when it is a substring of a real word', () => {
    // 'digital' contains 'ita'
    expect(purgeName('digital')).toBe('digl');
  });

  it('removes an invalid word that is not the extension', () => {
    expect(purgeName('guide epub book')).toBe('guide book');
  });

  it('replaces underscores with spaces', () => {
    expect(purgeName('my_great_book.pdf')).toBe('my great book');
  });

  it('replaces dashes with spaces', () => {
    expect(purgeName('my-great-book.pdf')).toBe('my great book');
  });

  it('replaces the remaining dots with spaces', () => {
    expect(purgeName('a.b.c.pdf')).toBe('a b c');
  });

  it('collapses a double space in a single pass only', () => {
    expect(purgeName('  ')).toBe(' ');
    expect(purgeName('    ')).toBe('  ');
  });
});
