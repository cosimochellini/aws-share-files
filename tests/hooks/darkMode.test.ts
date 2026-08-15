import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDarkMode } from '../../src/hooks/darkMode.hook';

const KEY = 'DARK_MODE';

describe('useDarkMode', () => {
  beforeEach(() => {
    // useDevice schedules a debounced resize handler on mount
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true and a setter', () => {
    const { result } = renderHook(() => useDarkMode());

    const [darkMode, setDarkMode] = result.current;

    expect(darkMode).toBe(true);
    expect(typeof setDarkMode).toBe('function');
  });

  it('always starts from true, whatever is persisted', () => {
    window.localStorage.setItem(KEY, JSON.stringify(false));

    const { result } = renderHook(() => useDarkMode());

    // KNOWN BUG: `darkMode` is initialised with a hardcoded `true` and never seeded from
    // the persisted `DARK_MODE` value, so a user who turned dark mode off still gets
    // `true` back on the next mount.
    expect(result.current[0]).toBe(true);
  });

  it('updates the returned flag and persists it', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      const [, setDarkMode] = result.current;

      setDarkMode(false);
    });

    expect(result.current[0]).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBe('false');

    act(() => {
      const [, setDarkMode] = result.current;

      setDarkMode(true);
    });

    expect(result.current[0]).toBe(true);
    expect(window.localStorage.getItem(KEY)).toBe('true');
  });
});
