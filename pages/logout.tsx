import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import type { GetStaticProps } from 'next';

import { withDefaultLayout } from '../layouts';
import { useAuth } from '../src/hooks/auth.hook';
import { useEffectOnceWhen } from '../src/hooks/once';

export const getStaticProps = (async (_) => ({ props: { } })) satisfies GetStaticProps;

const Logout = () => {
  const router = useRouter();
  const { onUnauthenticated } = useAuth();

  useEffectOnceWhen(() => {
    signOut({}).then(() => router.push('/'));

    onUnauthenticated();
  });

  return (
    <>
      <h1>Logout </h1>
      <p>logging out...</p>
    </>
  );
};

export default withDefaultLayout(Logout);
