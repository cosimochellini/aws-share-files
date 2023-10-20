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

  const { data: session, status } = useSession({
    onUnauthenticated,
    required: true,
  });

  const authenticated = useMemo(() => {
    if (status === 'loading') return true;

    return !!session.user?.email;
  }, [session?.user?.email, status]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session.user?.email) {
      onUnauthenticated();
    }
  }, [onUnauthenticated, session?.user?.email, status]);

  return {
    authenticated,
    session,
    onUnauthenticated,
  };
};
