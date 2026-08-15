import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQueryString } from '../../src/hooks/query.hook';
import { getQueryStringValue, setQueryStringValue } from '../../src/utils/queryString';

/**
 * src/utils/queryString.ts memoises URLSearchParams in a module level Map, so the real
 * implementation leaks state between tests. Mocking the module keeps every case isolated.
 */
vi.mock('../../src/utils/queryString', () => ({
  getQueryStringValue: vi.fn(),
  setQueryStringValue: vi.fn(),
}));

const mockedGet = vi.mocked(getQueryStringValue);
const mockedSet = vi.mocked(setQueryStringValue);

describe('useQueryString', () => {
  beforeEach(() => {
    // read straight from the current location, like the real implementation does
    mockedGet.mockImplementation(
      (key: string) => new URLSearchParams(window.location.search).get(key),
    );
  });

  it('reads the initial value from the current query string', () => {
    window.history.replaceState(null, '', '/?search=hello&other=1');

    const { result } = renderHook(() => useQueryString('search'));

    expect(mockedGet).toHaveBeenCalledWith('search');
    expect(result.current[0]).toBe('hello');
  });

  it('falls back to the initial value when the key is absent', () => {
    window.history.replaceState(null, '', '/?other=1');

    const { result } = renderHook(() => useQueryString('search', 'default-value'));

    expect(result.current[0]).toBe('default-value');
  });

  it('falls back to an empty string when no initial value is given', () => {
    window.history.replaceState(null, '', '/');

    const { result } = renderHook(() => useQueryString('search'));

    expect(result.current[0]).toBe('');
  });

  it('updates the value and writes it back to the query string', () => {
    window.history.replaceState(null, '', '/?search=hello');

    const { result } = renderHook(() => useQueryString('search'));

    act(() => {
      const [, onSetValue] = result.current;

      onSetValue('world');
    });

    expect(result.current[0]).toBe('world');
    expect(mockedSet).toHaveBeenCalledWith('search', 'world');
  });

  it('supports clearing the value', () => {
    window.history.replaceState(null, '', '/?search=hello');

    const { result } = renderHook(() => useQueryString('search'));

    act(() => {
      const [, onSetValue] = result.current;

      onSetValue(undefined);
    });

    expect(result.current[0]).toBeUndefined();
    expect(mockedSet).toHaveBeenCalledWith('search', undefined);
  });
});
