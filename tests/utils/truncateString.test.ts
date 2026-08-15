import { describe, expect, it } from 'vitest';

import { truncateString } from '../../src/utils/truncateString';

describe('truncateString', () => {
  it('leaves a string shorter than the limit untouched', () => {
    expect(truncateString('short', 10)).toBe('short');
  });

  it('leaves an empty string untouched', () => {
    expect(truncateString('', 10)).toBe('');
  });

  it('truncates a string whose length is exactly the limit, because the check uses "<"', () => {
    expect(truncateString('12345', 5)).toBe('12345...');
  });

  it('truncates a string longer than the limit', () => {
    expect(truncateString('abcdefghij', 3)).toBe('abc...');
  });

  it('defaults the limit to 30', () => {
    const twentyNine = 'a'.repeat(29);
    const thirty = 'a'.repeat(30);
    const thirtyOne = 'a'.repeat(31);

    expect(truncateString(twentyNine)).toBe(twentyNine);
    expect(truncateString(thirty)).toBe(`${thirty}...`);
    expect(truncateString(thirtyOne)).toBe(`${'a'.repeat(30)}...`);
  });
});
