import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { debounce, throttle } from '../../src/utils/callbacks';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('debounce', () => {
  it('does not call the function before the delay elapses', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 200);

    debounced();

    vi.advanceTimersByTime(199);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('only fires once, with the arguments of the last call', () => {
    const spy = vi.fn();
    const debounced = debounce<string>(spy, 200);

    debounced('first');
    vi.advanceTimersByTime(100);
    debounced('second');
    vi.advanceTimersByTime(100);
    debounced('third');

    vi.advanceTimersByTime(200);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('third');
  });

  it('forwards every argument', () => {
    const spy = vi.fn();
    const debounced = debounce<number>(spy);

    debounced(1, 2, 3);
    vi.advanceTimersByTime(200);

    expect(spy).toHaveBeenCalledWith(1, 2, 3);
  });

  it('defaults the delay to 200ms', () => {
    const spy = vi.fn();
    const debounced = debounce(spy);

    debounced();

    vi.advanceTimersByTime(199);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('honours a custom delay', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 1000);

    debounced();

    vi.advanceTimersByTime(999);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('fires again for a call made after the previous one has landed', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 50);

    debounced();
    vi.advanceTimersByTime(50);

    debounced();
    vi.advanceTimersByTime(50);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('throttle', () => {
  it('lets the first call through immediately', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('drops the calls made inside the limit window', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');
    throttled('b');
    vi.advanceTimersByTime(99);
    throttled('c');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('lets a call through again once the limit has elapsed', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');
    vi.advanceTimersByTime(100);
    throttled('b');

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'b');
  });

  it('defaults the limit to 100ms', () => {
    const spy = vi.fn();
    const throttled = throttle(spy);

    throttled();
    vi.advanceTimersByTime(99);
    throttled();
    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    throttled();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('preserves the "this" binding of the caller', () => {
    const spy = vi.fn();

    const owner = {
      name: 'owner',
      throttled: throttle(function report(this: { name: string }) {
        spy(this.name);
      }, 100),
    };

    owner.throttled();

    expect(spy).toHaveBeenCalledWith('owner');
  });
});
