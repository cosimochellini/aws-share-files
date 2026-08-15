import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLocalStorage } from '../../src/hooks/localStorage.hook';
import { notification } from '../../src/instances/notification';

const KEY = 'LS_TEST_KEY';

describe('useLocalStorage', () => {
  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('returns the parsed stored value', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ name: 'stored' }));

    const { result } = renderHook(() => useLocalStorage(KEY, { name: 'fallback' }));

    expect(result.current[0]).toEqual({ name: 'stored' });
  });

  it('notifies and falls back to the initial value on invalid JSON', () => {
    const errorSpy = vi.spyOn(notification, 'error');

    window.localStorage.setItem(KEY, '{ not json');

    const { result } = renderHook(() => useLocalStorage(KEY, 'fallback'));

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe('fallback');
  });

  it('updates the state and writes to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    act(() => {
      const [, setValue] = result.current;

      setValue('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('updated'));
  });

  it('calls an updater function with the previous value', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'first'));

    const updater = vi.fn((previous: string) => `${previous}-second`);

    act(() => {
      const [, setValue] = result.current;

      // the setter is typed as `T`, but it also supports the useState updater shape
      setValue(updater as unknown as string);
    });

    expect(updater).toHaveBeenCalledWith('first');
    expect(result.current[0]).toBe('first-second');
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('first-second'));
  });

  it('notifies when localStorage.setItem throws', () => {
    const errorSpy = vi.spyOn(notification, 'error');
    const failure = new Error('quota exceeded');

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw failure;
    });

    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    act(() => {
      const [, setValue] = result.current;

      setValue('updated');
    });

    expect(errorSpy).toHaveBeenCalledWith(failure);
    // the state still moved on, only the persistence failed
    expect(result.current[0]).toBe('updated');
  });
});
