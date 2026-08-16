import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDevice } from '../../src/hooks/device.hook';
import { device } from '../../src/services/device.service';

const flushDebounce = async () => {
  await act(async () => {
    vi.advanceTimersByTime(250);
  });
};

describe('useDevice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts from the all-false initial state', () => {
    const { result } = renderHook(() => useDevice());

    expect(result.current.isClient).toBe(false);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDarkMode).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.window).toBeNull();
    expect(result.current.hasWidth(0)).toBe(false);
    expect(result.current.runOnClient(() => undefined)).toBeUndefined();
  });

  it('reflects the real device once the debounced handler runs', async () => {
    const { result } = renderHook(() => useDevice());

    await flushDebounce();

    expect(result.current.isClient).toBe(true);
    expect(result.current.isDesktop).toBe(device.isDesktop);
    expect(result.current.isMobile).toBe(device.isMobile);
    expect(result.current.window).toBe(window);
  });

  it('delegates hasWidth to the device service', async () => {
    const hasWidthSpy = vi.spyOn(device, 'hasWidth');

    const { result } = renderHook(() => useDevice());

    await flushDebounce();

    expect(result.current.hasWidth(0)).toBe(true);
    expect(hasWidthSpy).toHaveBeenCalledWith(0);

    expect(result.current.hasWidth(Number.MAX_SAFE_INTEGER)).toBe(false);
  });

  it('reacts to a window resize event through the debounced listener', async () => {
    const { result } = renderHook(() => useDevice());

    await flushDebounce();

    const afterMount = result.current;

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // still debounced, nothing recomputed yet
    expect(result.current).toBe(afterMount);

    await flushDebounce();

    expect(result.current).not.toBe(afterMount);
    expect(result.current.isClient).toBe(true);
  });

  it('debounces a burst of resize events into a single update', async () => {
    const { result } = renderHook(() => useDevice());

    await flushDebounce();

    const afterMount = result.current;

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(50);
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(50);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(afterMount);

    await flushDebounce();

    expect(result.current).not.toBe(afterMount);
  });
});
