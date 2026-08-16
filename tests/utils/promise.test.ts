import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { unresolvedPromise, wait } from '../../src/utils/promise';

describe('wait', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('stays pending until the delay has elapsed', async () => {
    vi.useFakeTimers();

    const settled = vi.fn();

    wait(1000)
      .then(settled);

    await vi.advanceTimersByTimeAsync(999);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalledTimes(1);
  });

  it('resolves immediately enough with a zero delay', async () => {
    vi.useFakeTimers();

    const settled = vi.fn();

    wait(0)
      .then(settled);

    await vi.advanceTimersByTimeAsync(0);

    expect(settled).toHaveBeenCalledTimes(1);
  });
});

describe('unresolvedPromise', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the executor it is handed', async () => {
    const executor = vi.fn((resolve: (value: unknown) => void) => resolve('done'));

    await expect(unresolvedPromise(executor)).resolves.toBe('done');
    expect(executor).toHaveBeenCalledTimes(1);
  });

  it('propagates a rejection from the executor', async () => {
    const executor = (_resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => {
      reject(new Error('nope'));
    };

    await expect(unresolvedPromise(executor)).rejects.toThrow('nope');
  });

  it('never settles when no executor is given, because it falls back to noop', async () => {
    vi.useFakeTimers();

    const settled = vi.fn();

    const pending = unresolvedPromise(undefined);
    pending.then(settled, settled);

    const timer = new Promise((resolve) => {
      setTimeout(() => resolve('timer'), 5000);
    });

    const race = Promise.race([pending, timer]);

    await vi.advanceTimersByTimeAsync(5000);

    await expect(race).resolves.toBe('timer');
    expect(settled).not.toHaveBeenCalled();
  });
});
