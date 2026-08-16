import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

import { jsonOrThrow, reportAndRethrow } from '../../src/utils/apiResponse';
import { notification } from '../../src/instances/notification';

const response = (init: Partial<Response> & { json?: () => Promise<unknown> }) => init as Response;

describe('jsonOrThrow', () => {
  it('parses the body of a successful response', async () => {
    const parse = jsonOrThrow('content', '/volumes');

    await expect(parse(response({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'job-1' }),
    }))).resolves.toEqual({ id: 'job-1' });
  });

  it('names the api and the section in the error it raises', () => {
    const parse = jsonOrThrow('converter', 'jobs/job-1');

    expect(() => parse(response({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }))).toThrowError('the converter API answered jobs/job-1 with 500');
  });

  it('never reads the body of a failed response', () => {
    let bodyWasRead = false;

    const parse = jsonOrThrow('content', '/volumes');

    expect(() => parse(response({
      ok: false,
      status: 429,
      json: () => {
        bodyWasRead = true;
        return Promise.resolve({ error: 'rate limited' });
      },
    }))).toThrowError('the content API answered /volumes with 429');

    expect(bodyWasRead).toBe(false);
  });
});

describe('reportAndRethrow', () => {
  beforeEach(() => {
    vi.spyOn(notification, 'error').mockImplementation(() => {});
  });

  it('notifies and then lets the original error through', () => {
    const failure = new Error('network down');

    expect(() => reportAndRethrow(failure)).toThrowError(failure);

    expect(notification.error).toHaveBeenCalledWith(failure);
  });

  it('rethrows a non-Error rejection unchanged', () => {
    expect(() => reportAndRethrow('nope')).toThrowError('nope');

    expect(notification.error).toHaveBeenCalledWith('nope');
  });
});
