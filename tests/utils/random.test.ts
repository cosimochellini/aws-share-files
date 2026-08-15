import { describe, expect, it, vi } from 'vitest';

import { randomId } from '../../src/utils/random';

describe('randomId', () => {
  it('concatenates the base36 timestamp with the base36 random fraction', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

    expect(randomId()).toBe(
      (1700000000000).toString(36) + (0.123456789).toString(36).substring(2),
    );
  });

  it('drops the leading "0." of the random part', () => {
    vi.spyOn(Date, 'now').mockReturnValue(0);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(randomId()).toBe('0i');
  });

  it('produces different ids on consecutive calls with the real implementations', () => {
    expect(randomId()).not.toBe(randomId());
  });

  it('produces a string containing only base36 characters', () => {
    expect(randomId()).toMatch(/^[0-9a-z]+$/);
  });
});
