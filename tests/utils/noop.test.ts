import { describe, expect, it } from 'vitest';

import { noop } from '../../src/utils/noop';

describe('noop', () => {
  it('returns undefined', () => {
    expect(noop()).toBeUndefined();
  });

  it('accepts being called repeatedly without side effects', () => {
    expect(() => {
      noop();
      noop();
    }).not.toThrow();
  });
});
