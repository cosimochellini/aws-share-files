import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo } from 'react';

export const loginPath = '/api/auth/signin';

export const useAuth = () => {
  const router = useRouter();

  const onUnauthenticated = useCallback(async () => {
    if (router.pathname === loginPath) return;

    await router.push(loginPath);
  }, [router]);

  // no `required: true`: next-auth rewrites the status to 'loading' whenever it is
  // 'unauthenticated' and required is set, and runs its own copy of the redirect from an
  // internal effect. This hook would then never observe a signed-out visitor, and
  // `authenticated` would report true for one. The effect below owns the redirect instead.
  const { data: session, status } = useSession();

  const authenticated = useMemo(
    () => status === 'authenticated' && !!session?.user?.email,
    [session?.user?.email, status],
  );

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      onUnauthenticated();
    }
  }, [onUnauthenticated, session?.user?.email, status]);

  return {
    authenticated,
    session,
    onUnauthenticated,
  };
};
