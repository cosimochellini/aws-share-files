import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import type { GetStaticProps } from 'next';

import { withDefaultLayout } from '../layouts';
import { loginPath } from '../src/hooks/auth.hook';
import { useEffectOnceWhen } from '../src/hooks/once';
import { notification } from '../src/instances/notification';

export const getStaticProps = (async (_) => ({ props: { } })) satisfies GetStaticProps;

const Logout = () => {
  const router = useRouter();

  // One owner for the navigation. signOut defaults to redirect: true with a callbackUrl of
  // the current href, which reloads /logout in full and races whatever else is redirecting
  // -- and useAuth's effect would be doing exactly that, since the session is being torn
  // down underneath it. So this page does not call useAuth at all, and drives the single
  // navigation itself once next-auth has actually cleared the session.
  useEffectOnceWhen(() => {
    signOut({ redirect: false })
      .then(() => router.push(loginPath))
      // without this a failed sign-out request is an unhandled rejection and the visitor
      // sits on "logging out..." for ever with nothing said
      .catch(notification.error);
  });

  return (
    <>
      <h1>Logout </h1>
      <p>logging out...</p>
    </>
  );
};

export default withDefaultLayout(Logout);
