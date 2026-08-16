import type { NextApiRequest } from 'next';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultBehavior } from '../../../src/utils/api/composable';
import type { BaseResponse } from '../../../src/types/generic';

vi.mock('next-auth/react', () => ({ getSession: vi.fn() }));

const getSessionMock = vi.mocked(getSession);

const createRes = () => {
  const status = vi.fn<(code: number) => unknown>();
  const json = vi.fn<(body: unknown) => unknown>();

  const res = { status, json };

  status.mockReturnValue(res);
  json.mockReturnValue(res);

  return res;
};

const req = {} as NextApiRequest;

const asResponse = (res: ReturnType<typeof createRes>) => res as unknown as BaseResponse;

const authorizedSession = {
  user: { email: 'allowed@example.test' },
  expires: '2099-01-01T00:00:00.000Z',
} as Session;

describe('defaultBehavior', () => {
  beforeEach(() => {
    getSessionMock.mockResolvedValue(null);
  });

  it('answers 401 when there is no session', async () => {
    const res = createRes();
    const apiFn = vi.fn();

    await defaultBehavior(apiFn)(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'You must be logged in to access this page.',
    });
    expect(apiFn).not.toHaveBeenCalled();
  });

  it('answers 403 when the session email is not authorized', async () => {
    getSessionMock.mockResolvedValue({
      user: { email: 'intruder@example.test' },
      expires: '2099-01-01T00:00:00.000Z',
    } as Session);

    const res = createRes();
    const apiFn = vi.fn();

    await defaultBehavior(apiFn)(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'You are not authorized to access this page.',
    });
    expect(apiFn).not.toHaveBeenCalled();
  });

  it('answers 403 when the session carries no user at all', async () => {
    getSessionMock.mockResolvedValue({} as Session);

    const res = createRes();

    await defaultBehavior(vi.fn())(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'You are not authorized to access this page.',
    });
  });

  it('answers 200 with the value of a synchronous handler', async () => {
    getSessionMock.mockResolvedValue(authorizedSession);

    const res = createRes();
    const apiFn = vi.fn(() => ({ files: ['a'] }));

    await defaultBehavior(apiFn)(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ files: ['a'] });
  });

  it('awaits an asynchronous handler before answering 200', async () => {
    getSessionMock.mockResolvedValue(authorizedSession);

    const res = createRes();
    const apiFn = vi.fn(async () => 'resolved value');

    await defaultBehavior(apiFn)(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('resolved value');
  });

  it('hands the request, the response and the session to the handler', async () => {
    getSessionMock.mockResolvedValue(authorizedSession);

    const res = createRes();
    const apiFn = vi.fn();

    await defaultBehavior(apiFn)(req, asResponse(res));

    expect(getSessionMock).toHaveBeenCalledWith({ req });
    expect(apiFn).toHaveBeenCalledWith(req, res, authorizedSession);
  });

  it('accepts every authorized email of the configured list', async () => {
    getSessionMock.mockResolvedValue({
      user: { email: 'second@example.test' },
      expires: '2099-01-01T00:00:00.000Z',
    } as Session);

    const res = createRes();

    await defaultBehavior(() => 'ok')(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('answers 400 with the retrieved error when the handler throws', async () => {
    getSessionMock.mockResolvedValue(authorizedSession);

    const res = createRes();

    await defaultBehavior(() => {
      throw new Error('handler exploded');
    })(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'handler exploded' });
  });

  it('answers 400 when the handler rejects', async () => {
    getSessionMock.mockResolvedValue(authorizedSession);

    const res = createRes();

    await defaultBehavior(() => Promise.reject(new Error('async explosion')))(
      req,
      asResponse(res),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'async explosion' });
  });

  it('answers 400 when getSession itself throws', async () => {
    getSessionMock.mockRejectedValue(new Error('session lookup failed'));

    const res = createRes();

    await defaultBehavior(vi.fn())(req, asResponse(res));

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'session lookup failed' });
  });

  it('skips authentication and passes a null session when shouldAuthenticate is false', async () => {
    const res = createRes();
    const apiFn = vi.fn(() => 'public');

    await defaultBehavior(apiFn, { shouldAuthenticate: false })(req, asResponse(res));

    expect(getSessionMock).not.toHaveBeenCalled();
    expect(apiFn).toHaveBeenCalledWith(req, res, null);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('public');
  });
});
