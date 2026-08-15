import { describe, expect, it } from 'vitest';

import { retrieveError } from '../../src/utils/retrieveError';

describe('retrieveError', () => {
  it('unwraps the message of an Error', () => {
    expect(retrieveError(new Error('boom'))).toBe('boom');
  });

  it('unwraps the message of an Error subclass', () => {
    expect(retrieveError(new TypeError('bad type'))).toBe('bad type');
  });

  it('returns a string unchanged', () => {
    expect(retrieveError('plain failure')).toBe('plain failure');
  });

  it('returns an empty string unchanged', () => {
    expect(retrieveError('')).toBe('');
  });

  it('pretty prints a plain object', () => {
    const error = { code: 500, message: 'nope' };

    expect(retrieveError(error)).toBe(JSON.stringify(error, null, 2));
  });

  it('pretty prints an array', () => {
    expect(retrieveError([1, 'two'])).toBe(JSON.stringify([1, 'two'], null, 2));
  });

  it('stringifies null, because typeof null is "object"', () => {
    expect(retrieveError(null)).toBe('null');
  });

  it('falls back to "Unknown error" for a number', () => {
    expect(retrieveError(42)).toBe('Unknown error');
  });

  it('falls back to "Unknown error" for a boolean', () => {
    expect(retrieveError(false)).toBe('Unknown error');
  });

  it('falls back to "Unknown error" for undefined', () => {
    expect(retrieveError(undefined)).toBe('Unknown error');
  });

  it('falls back to "Unknown error" for a function', () => {
    expect(retrieveError(() => 'nope')).toBe('Unknown error');
  });
});
