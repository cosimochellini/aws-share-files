import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSSRSafeSelector, useSSRSafeStore } from '../../src/hooks/ssr.hook';

interface State {
  value: string;
}

describe('useSSRSafeStore', () => {
  it('returns the default state on the first render and the real one afterwards', async () => {
    const state: State = { value: 'real' };
    const defaultState: State = { value: 'default' };

    const renders: State[] = [];

    const { result } = renderHook(() => {
      const current = useSSRSafeStore(state, defaultState);

      renders.push(current);

      return current;
    });

    expect(renders[0]).toBe(defaultState);

    await waitFor(() => {
      expect(result.current).toBe(state);
    });
  });

  it('keeps returning the real state on later rerenders', async () => {
    const state: State = { value: 'real' };
    const defaultState: State = { value: 'default' };

    const { result, rerender } = renderHook(() => useSSRSafeStore(state, defaultState));

    await waitFor(() => {
      expect(result.current).toBe(state);
    });

    rerender();

    expect(result.current).toBe(state);
  });
});

describe('useSSRSafeSelector', () => {
  it('returns the default state on the first render and the selected one afterwards', async () => {
    const state: State = { value: 'selected' };
    const defaultState: State = { value: 'default' };

    const selector = vi.fn(() => state);

    const renders: State[] = [];

    const { result } = renderHook(() => {
      const current = useSSRSafeSelector(selector, defaultState);

      renders.push(current);

      return current;
    });

    expect(renders[0]).toBe(defaultState);
    expect(selector).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current).toBe(state);
    });
  });

  it('calls the selector on every render', async () => {
    const state: State = { value: 'selected' };
    const defaultState: State = { value: 'default' };

    const selector = vi.fn(() => state);

    const { rerender } = renderHook(() => useSSRSafeSelector(selector, defaultState));

    const callsAfterMount = selector.mock.calls.length;

    rerender();

    expect(selector.mock.calls.length).toBeGreaterThan(callsAfterMount);
  });
});
