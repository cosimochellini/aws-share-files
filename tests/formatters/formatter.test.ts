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
  it('formats a date five minutes in the past', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() - 5 * 60 * 1000)))
      .toBe('5 minutes ago');
  });

  it('formats a date three hours in the future', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 3 * 60 * 60 * 1000)))
      .toBe('in 3 hours');
  });

  it('picks the largest matching unit, not the smallest', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)))
      .toBe('2 months ago');
  });

  it('formats a date years away in years', () => {
    expect(formatter.relativeFormatter(new Date(2020, 0, 1))).toBe('4 years ago');
  });

  it('accepts an ISO string as well', () => {
    expect(formatter.relativeFormatter('2020-01-01T00:00:00')).toBe('4 years ago');
  });

  it('formats a date just past the one second boundary in seconds', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() - 1500))).toBe('1 second ago');
  });

  it('falls back to zero seconds for the current instant, the default of a nullish date', () => {
    expect(formatter.relativeFormatter(nullDate)).toBe('in 0 seconds');
    expect(formatter.relativeFormatter(undefined)).toBe('in 0 seconds');
  });

  it('falls back to zero seconds for a date less than a second away', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 500))).toBe('in 0 seconds');
  });

  it('still reports zero seconds exactly one second away, because the check is strict', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() + 1000))).toBe('in 0 seconds');
  });

  it('drops to the next unit down at an exact unit boundary', () => {
    expect(formatter.relativeFormatter(new Date(now.getTime() - 24 * 60 * 60 * 1000)))
      .toBe('24 hours ago');
  });
});
