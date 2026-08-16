import { describe, expect, it, vi } from 'vitest';

import { device } from '../../src/services/device.service';

/**
 * The getters read the *global* `window` through `typeof window !== 'undefined'`,
 * so the SSR branches are reached by stubbing the global away entirely.
 * `tests/setup.ts` calls `vi.unstubAllGlobals()` after every test, restoring jsdom's.
 */
const stubMatchMedia = (matches: Record<string, boolean>) => {
  const matchMedia = vi.fn((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
  } as MediaQueryList));

  window.matchMedia = matchMedia;

  return matchMedia;
};

describe('device.isClient', () => {
  it('is true under jsdom', () => {
    expect(device.isClient).toBe(true);
  });

  it('is false when window is undefined', () => {
    vi.stubGlobal('window', undefined);

    expect(device.isClient).toBe(false);
  });
});

describe('device.window', () => {
  it('returns the global window on the client', () => {
    expect(device.window).toBe(window);
  });

  it('returns null on the server', () => {
    vi.stubGlobal('window', undefined);

    expect(device.window).toBeNull();
  });
});

describe('device.isMobile / device.isDesktop', () => {
  it('is mobile when the max-width media query matches', () => {
    const matchMedia = stubMatchMedia({ '(max-width: 767px)': true });

    expect(device.isMobile).toBe(true);
    expect(device.isDesktop).toBe(false);
    expect(matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('is desktop when the max-width media query does not match', () => {
    stubMatchMedia({ '(max-width: 767px)': false });

    expect(device.isMobile).toBe(false);
    expect(device.isDesktop).toBe(true);
  });

  it('defaults to desktop when there is no window', () => {
    vi.stubGlobal('window', undefined);

    expect(device.isMobile).toBe(false);
    expect(device.isDesktop).toBe(true);
  });
});

describe('device.isDarkMode', () => {
  it('is true when the colour-scheme query matches', () => {
    const matchMedia = stubMatchMedia({ '(prefers-color-scheme: dark)': true });

    expect(device.isDarkMode).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('is false when the colour-scheme query does not match', () => {
    stubMatchMedia({ '(prefers-color-scheme: dark)': false });

    expect(device.isDarkMode).toBe(false);
  });

  it('defaults to true when there is no window', () => {
    vi.stubGlobal('window', undefined);

    expect(device.isDarkMode).toBe(true);
  });
});

describe('device.hasWidth', () => {
  it('is true when the viewport is at least as wide as the threshold', () => {
    vi.stubGlobal('innerWidth', 1024);

    expect(device.hasWidth(1024)).toBe(true);
    expect(device.hasWidth(800)).toBe(true);
  });

  it('is false when the viewport is narrower than the threshold', () => {
    vi.stubGlobal('innerWidth', 320);

    expect(device.hasWidth(768)).toBe(false);
  });

  it('falls back to a width of 0 when there is no window', () => {
    vi.stubGlobal('window', undefined);

    expect(device.hasWidth(1)).toBe(false);
    expect(device.hasWidth(0)).toBe(true);
  });
});

describe('device.runOnClient', () => {
  it('invokes the callback on the client', () => {
    const callback = vi.fn();

    device.runOnClient(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the callback when there is no window', () => {
    const callback = vi.fn();

    vi.stubGlobal('window', undefined);

    device.runOnClient(callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
