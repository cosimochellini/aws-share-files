import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginPath, useAuth } from '../../src/hooks/auth.hook';

vi.mock('next/router', () => ({ useRouter: vi.fn() }));

vi.mock('next-auth/react', () => ({ useSession: vi.fn() }));

const mockedUseRouter = useRouter as unknown as Mock;
const mockedUseSession = useSession as unknown as Mock;

const buildSession = (email?: string) => ({
  user: email ? { email } : {},
  expires: '2999-01-01T00:00:00.000Z',
} as Session);

const push = vi.fn();

const givenRoute = (pathname: string) => {
  mockedUseRouter.mockReturnValue({ pathname, push });
};

const givenSession = (data: Session | null, status: string) => {
  mockedUseSession.mockReturnValue({ data, status, update: vi.fn() });
};

describe('useAuth', () => {
  beforeEach(() => {
    push.mockResolvedValue(true);
    givenRoute('/files');
  });

  it('exposes the next-auth sign in path', () => {
    expect(loginPath).toBe('/api/auth/signin');
  });

  it('asks next-auth for a required session with an unauthenticated handler', () => {
    givenSession(buildSession('allowed@example.test'), 'authenticated');

    renderHook(() => useAuth());

    expect(mockedUseSession).toHaveBeenCalledWith({
      onUnauthenticated: expect.any(Function),
      required: true,
    });
  });

  it('treats a loading session as authenticated and does not redirect', () => {
    givenSession(null, 'loading');

    const { result } = renderHook(() => useAuth());

    expect(result.current.authenticated).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it('is authenticated when the session carries an email', () => {
    const session = buildSession('allowed@example.test');

    givenSession(session, 'authenticated');

    const { result } = renderHook(() => useAuth());

    expect(result.current.authenticated).toBe(true);
    expect(result.current.session).toBe(session);
    expect(push).not.toHaveBeenCalled();
  });

  it('redirects to the login page when the session has no email', async () => {
    givenSession(buildSession(), 'unauthenticated');

    const { result } = renderHook(() => useAuth());

    expect(result.current.authenticated).toBe(false);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(loginPath);
    });

    expect(push).toHaveBeenCalledTimes(1);
  });

  it('does not redirect when already sitting on the login page', async () => {
    givenRoute(loginPath);
    givenSession(buildSession(), 'unauthenticated');

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authenticated).toBe(false);
    });

    expect(push).not.toHaveBeenCalled();
  });

  it('exposes onUnauthenticated, which is a no-op on the login page', async () => {
    givenRoute(loginPath);
    givenSession(buildSession('allowed@example.test'), 'authenticated');

    const { result } = renderHook(() => useAuth());

    await result.current.onUnauthenticated();

    expect(push).not.toHaveBeenCalled();
  });

  it('exposes onUnauthenticated, which pushes from any other page', async () => {
    givenSession(buildSession('allowed@example.test'), 'authenticated');

    const { result } = renderHook(() => useAuth());

    await result.current.onUnauthenticated();

    expect(push).toHaveBeenCalledWith(loginPath);
  });

  it('redirects to the login page when next-auth hands back a null session', async () => {
    givenSession(null, 'unauthenticated');

    const { result } = renderHook(() => useAuth());

    expect(result.current.authenticated).toBe(false);
    expect(result.current.session).toBeNull();

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(loginPath);
    });

    expect(push).toHaveBeenCalledTimes(1);
  });
});
