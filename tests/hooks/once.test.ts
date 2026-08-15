import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEffectOnceWhen } from '../../src/hooks/once';

interface Props {
  callback: () => void;
  when?: boolean;
}

const render = (initialProps: Props) => renderHook(
  ({ callback, when }: Props) => useEffectOnceWhen(callback, when),
  { initialProps },
);

describe('useEffectOnceWhen', () => {
  it('fires on mount when `when` defaults to true', () => {
    const callback = vi.fn();

    renderHook(() => useEffectOnceWhen(callback));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire while `when` is false and fires as soon as it flips', () => {
    const callback = vi.fn();

    const { rerender } = render({ callback, when: false });

    expect(callback).not.toHaveBeenCalled();

    rerender({ callback, when: false });

    expect(callback).not.toHaveBeenCalled();

    rerender({ callback, when: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('fires only once across many rerenders', () => {
    const callback = vi.fn();

    const { rerender } = render({ callback, when: true });

    rerender({ callback, when: true });
    rerender({ callback, when: false });
    rerender({ callback, when: true });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('uses the latest callback because the ref is refreshed on every render', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = render({ callback: first, when: false });

    rerender({ callback: second, when: false });
    rerender({ callback: second, when: true });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('accepts an async callback', async () => {
    const callback = vi.fn(async () => {});

    renderHook(() => useEffectOnceWhen(callback));

    expect(callback).toHaveBeenCalledTimes(1);

    await Promise.resolve();
  });
});
