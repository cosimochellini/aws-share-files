import { describe, expect, it } from 'vitest';

import { sharedConfiguration } from '../../src/instances/sharedConfiguration';

describe('sharedConfiguration', () => {
  it('exposes the shared name and item limits', () => {
    expect(sharedConfiguration).toEqual({
      name: 'sharedConfiguration',
      itemsConfiguration: {
        maxCount: 10,
      },
    });
  });

  it('caps the shared items at 10', () => {
    expect(sharedConfiguration.itemsConfiguration.maxCount).toBe(10);
  });
});
