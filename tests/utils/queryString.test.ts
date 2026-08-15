import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { getQueryStringValue, setQueryStringValue } from '../../src/utils/queryString';

/**
 * src/utils/queryString.ts keeps a module level Map keyed by the raw search string, so
 * every test below uses its own distinct search string to avoid leaking state between
 * cases. The isolated re-import at the bottom uses vi.resetModules() instead.
 */

describe('getQueryStringValue', () => {
  it('reads a value that is present', () => {
    expect(getQueryStringValue('a', '?a=1&b=2')).toBe('1');
  });

  it('reads every value of the same search string from the cache', () => {
    expect(getQueryStringValue('b', '?a=1&b=2')).toBe('2');
  });

  it('returns null for an absent key', () => {
    expect(getQueryStringValue('missing', '?a=1&b=2')).toBeNull();
  });

  it('returns null for an empty search string', () => {
    expect(getQueryStringValue('a', '')).toBeNull();
  });

  it('purges pairs that have no value', () => {
    expect(getQueryStringValue('empty', '?empty=&kept=yes')).toBeNull();
    expect(getQueryStringValue('kept', '?empty=&kept=yes')).toBe('yes');
  });

  it('purges a trailing empty pair', () => {
    expect(getQueryStringValue('kept', '?kept=yes&trailing=')).toBe('yes');
    expect(getQueryStringValue('trailing', '?kept=yes&trailing=')).toBeNull();
  });

  it('falls back to window.location.search when no query string is given', () => {
    window.history.replaceState({}, '', '/files?fromLocation=42');

    expect(getQueryStringValue('fromLocation')).toBe('42');
  });
});

describe('setQueryStringValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('pushes the rebuilt path onto the history, debounced', () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    setQueryStringValue('page', '3', '?set=first');

    expect(pushState).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    const { protocol, host, pathname } = window.location;
    const path = `${protocol}//${host}${pathname}?set=first&page=3`;

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith({ path }, '//', path);
  });

  it('makes the new value readable through getQueryStringValue', () => {
    setQueryStringValue('page', '7', '?set=second');
    vi.advanceTimersByTime(200);

    expect(getQueryStringValue('page', '?set=second')).toBe('7');
  });

  it('stores an empty string when the value is null', () => {
    // Nullable<string> only allows undefined, but a real null reaches this in the app.
    setQueryStringValue('page', null as unknown as string, '?set=third');
    vi.advanceTimersByTime(200);

    expect(getQueryStringValue('page', '?set=third')).toBe('');
  });

  it('stores an empty string when the value is undefined', () => {
    setQueryStringValue('page', undefined, '?set=fourth');
    vi.advanceTimersByTime(200);

    expect(getQueryStringValue('page', '?set=fourth')).toBe('');
  });

  it('overwrites an existing key rather than appending it', () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    setQueryStringValue('existing', 'new', '?existing=old');
    vi.advanceTimersByTime(200);

    const path = pushState.mock.calls[0]?.[2];

    expect(path).toContain('existing=new');
    expect(path).not.toContain('existing=old');
  });

  it('only pushes once when called repeatedly inside the debounce window', () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    setQueryStringValue('page', '1', '?set=fifth');
    setQueryStringValue('page', '2', '?set=fifth');
    setQueryStringValue('page', '3', '?set=fifth');

    vi.advanceTimersByTime(200);

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState.mock.calls[0]?.[2]).toContain('page=3');
  });

  it('falls back to window.location.search when no query string is given', () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    window.history.replaceState({}, '', '/files?setFromLocation=1');
    pushState.mockClear();

    setQueryStringValue('added', 'yes');
    vi.advanceTimersByTime(200);

    expect(pushState.mock.calls[0]?.[2]).toContain('added=yes');
  });

  it('does nothing when there is no window (server side rendering)', async () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    vi.resetModules();
    vi.stubGlobal('window', undefined);

    const isolated = await import('../../src/utils/queryString');

    isolated.setQueryStringValue('page', '1', '?set=ssr');
    vi.advanceTimersByTime(200);

    expect(pushState).not.toHaveBeenCalled();
  });
});
