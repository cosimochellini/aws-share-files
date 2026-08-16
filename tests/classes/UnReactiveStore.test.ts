import { describe, expect, it, vi } from 'vitest';

import { UnReactiveStore } from '../../src/classes/UnReactiveStore';
import { notification } from '../../src/instances/notification';

vi.mock('../../src/instances/notification', () => ({
  notification: { error: vi.fn() },
}));

const notificationError = vi.mocked(notification.error);

describe('UnReactiveStore.value', () => {
  it('returns the initial value when nothing is stored', () => {
    const store = new UnReactiveStore('empty-key', { theme: 'dark' });

    expect(store.value).toEqual({ theme: 'dark' });
    expect(notificationError).not.toHaveBeenCalled();
  });

  it('returns the parsed stored value', () => {
    window.localStorage.setItem('stored-key', JSON.stringify({ theme: 'light' }));

    const store = new UnReactiveStore('stored-key', { theme: 'dark' });

    expect(store.value).toEqual({ theme: 'light' });
  });

  it('returns primitives that were stored', () => {
    window.localStorage.setItem('number-key', JSON.stringify(42));

    expect(new UnReactiveStore('number-key', 0).value).toBe(42);
  });

  it('returns the initial value when the stored item is an empty string', () => {
    window.localStorage.setItem('blank-key', '');

    expect(new UnReactiveStore('blank-key', 'fallback').value).toBe('fallback');
  });

  it('notifies and falls back to the initial value when the stored JSON is invalid', () => {
    window.localStorage.setItem('broken-key', '{not json');

    const store = new UnReactiveStore('broken-key', 'fallback');

    expect(store.value).toBe('fallback');
    expect(notificationError).toHaveBeenCalledTimes(1);
    expect(notificationError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
  });
});

describe('UnReactiveStore.set', () => {
  it('writes the serialised value to local storage', () => {
    const store = new UnReactiveStore('write-key', { theme: 'dark' });

    store.set({ theme: 'light' });

    expect(window.localStorage.getItem('write-key')).toBe(JSON.stringify({ theme: 'light' }));
    expect(store.value).toEqual({ theme: 'light' });
    expect(notificationError).not.toHaveBeenCalled();
  });

  it('notifies instead of throwing when local storage refuses the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const store = new UnReactiveStore('quota-key', 'initial');

    expect(() => store.set('value')).not.toThrow();
    expect(notificationError).toHaveBeenCalledTimes(1);
    expect(notificationError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
  });
});

describe('UnReactiveStore without a window (server side rendering)', () => {
  it('returns the initial value and never touches local storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    const store = new UnReactiveStore('ssr-key', 'initial');

    vi.stubGlobal('window', undefined);

    expect(store.value).toBe('initial');
    expect(() => store.set('ignored')).not.toThrow();

    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(notificationError).not.toHaveBeenCalled();
  });
});
