import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { formatter } from '../../src/formatters/formatter';

const now = new Date(2024, 0, 2, 9, 5, 0);

// The `datable` type only allows `undefined`, but callers coming from the S3 objects
// hand over a real `null`, so the runtime behaviour is worth pinning too.
const nullDate = null as unknown as Date;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('dateFormatter', () => {
  it('formats a Date as dd/MM/yyyy in en-US order', () => {
    expect(formatter.dateFormatter(new Date(2024, 2, 5, 12, 0, 0))).toBe('03/05/2024');
  });

  it('formats an ISO string', () => {
    expect(formatter.dateFormatter('2024-07-20T12:00:00')).toBe('07/20/2024');
  });

  it('falls back to the current date for null', () => {
    expect(formatter.dateFormatter(nullDate)).toBe('01/02/2024');
  });

  it('falls back to the current date for undefined', () => {
    expect(formatter.dateFormatter(undefined)).toBe('01/02/2024');
  });

  it('falls back to the current date for an empty string', () => {
    expect(formatter.dateFormatter('')).toBe('01/02/2024');
  });
});

describe('timeFormatter', () => {
  it('zero pads both the hours and the minutes', () => {
    expect(formatter.timeFormatter(new Date(2024, 0, 1, 9, 5))).toBe('09:05');
  });

  it('does not pad hours and minutes above nine', () => {
    expect(formatter.timeFormatter(new Date(2024, 0, 1, 14, 30))).toBe('14:30');
  });

  it('pads only the hours when the minutes are above nine', () => {
    expect(formatter.timeFormatter(new Date(2024, 0, 1, 8, 45))).toBe('08:45');
  });

  it('pads only the minutes when the hours are above nine', () => {
    expect(formatter.timeFormatter(new Date(2024, 0, 1, 23, 7))).toBe('23:07');
  });

  it('falls back to the current time when no date is given', () => {
    expect(formatter.timeFormatter(undefined)).toBe('09:05');
  });
});

describe('fileFormatter', () => {
  it('returns "0 Byte" for zero, the only special case', () => {
    expect(formatter.fileFormatter(0)).toBe('0 Byte');
  });

  it('formats sizes below one kilobyte in bytes', () => {
    expect(formatter.fileFormatter(512)).toBe('512 Bytes');
  });

  it('formats one byte', () => {
    expect(formatter.fileFormatter(1)).toBe('1 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatter.fileFormatter(2048)).toBe('2 KB');
  });

  it('formats megabytes', () => {
    expect(formatter.fileFormatter(5 * 1024 ** 2)).toBe('5 MB');
  });

  it('formats gigabytes', () => {
    expect(formatter.fileFormatter(3 * 1024 ** 3)).toBe('3 GB');
  });

  it('rounds to the nearest whole unit', () => {
    expect(formatter.fileFormatter(1536)).toBe('2 KB');
  });
});

describe('relativeFormatter', () => {
  // KNOWN BUG: relativeFormatter returns the *range key* ('seconds', 'minutes', ...)
  // instead of the formatted relative string. Array.prototype.find expects a boolean
  // predicate, but the callback returns `rtf.format(...)` — a non-empty, always truthy
  // string — so `find` stops at the very first range whose size is smaller than the
  // elapsed time (always 'seconds' for anything more than one second away) and yields
  // that key. The tests below pin the CURRENT behaviour, they do not describe the
  // intended one. Fixing formatter.ts is out of scope here.

  it('returns "seconds" for a date five minutes in the past', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() - 5 * 60 * 1000))).toBe('seconds');
  });

  it('returns "seconds" for a date two hours in the future', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 2 * 60 * 60 * 1000))).toBe('seconds');
  });

  it('returns "seconds" for a date years away, instead of "years"', () => {
    expect(formatter.relativeFormatter(new Date(2020, 0, 1))).toBe('seconds');
  });

  it('returns undefined for a date less than a second away', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 500))).toBeUndefined();
  });

  it('returns undefined for the current instant, the default of a nullish date', () => {
    expect(formatter.relativeFormatter(nullDate)).toBeUndefined();
    expect(formatter.relativeFormatter(undefined)).toBeUndefined();
  });

  it('returns undefined for a date exactly one second away, because the check is strict', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 1000))).toBeUndefined();
  });

  it('accepts an ISO string as well', () => {
    expect(formatter.relativeFormatter('2020-01-01T00:00:00')).toBe('seconds');
  });
});
