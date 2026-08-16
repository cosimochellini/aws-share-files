import { describe, expect, it } from 'vitest';

import packageJson from '../../package.json';
import { settings } from '../../src/instances/settings';

describe('settings', () => {
  it('exposes the package.json metadata', () => {
    expect(settings.name).toBe(packageJson.name);
    expect(settings.version).toBe(packageJson.version);
  });

  it('exposes a semver-shaped version, which the settings page renders', () => {
    expect(settings.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
