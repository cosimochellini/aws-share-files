import { describe, expect, it } from 'vitest';

import { trowIfNull } from '../../src/utils/throw';

const message = 'Value is null or undefined, cannot be used.';

describe('trowIfNull', () => {
  it('returns the value when it is defined', () => {
    expect(trowIfNull('value')).toBe('value');
  });

  it('returns an object identity unchanged', () => {
    const value = { a: 1 };

    expect(trowIfNull(value)).toBe(value);
  });

  it('lets the falsy value 0 through', () => {
    expect(trowIfNull(0)).toBe(0);
  });

  it('lets the falsy value "" through', () => {
    expect(trowIfNull('')).toBe('');
  });

  it('lets the falsy value false through', () => {
    expect(trowIfNull(false)).toBe(false);
  });

  it('lets NaN through', () => {
    expect(trowIfNull(NaN)).toBeNaN();
  });

  it('throws on null', () => {
    expect(() => trowIfNull(null)).toThrow(message);
  });

  it('throws on undefined', () => {
    expect(() => trowIfNull(undefined)).toThrow(message);
  });
});
