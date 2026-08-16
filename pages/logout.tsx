import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import type { GetStaticProps } from 'next';

import { withDefaultLayout } from '../layouts';
import { useAuth } from '../src/hooks/auth.hook';
import { useEffectOnceWhen } from '../src/hooks/once';

export const getStaticProps = (async (_) => ({ props: { } })) satisfies GetStaticProps;

const Logout = () => {
  const router = useRouter();

  // useAuth's own effect sends a session-less visitor to the login page, so this page does
  // not call onUnauthenticated itself: it would fire the same redirect a second time.
  useAuth();

  useEffectOnceWhen(() => {
    signOut({}).then(() => router.push('/'));
  });

  return (
    <>
      <h1>Logout </h1>
      <p>logging out...</p>
    </>
  );
};

export default withDefaultLayout(Logout);
