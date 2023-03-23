import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { withDefaultLayout } from '../layouts';
import { useEffectOnceWhen } from '../src/hooks/once';

export const getStaticProps = (async (_) => ({ props: { } })) satisfies GetStaticProps;

const Index = () => {
  const router = useRouter();

  useEffectOnceWhen(async () => {
    await router.push('/files');
  });

  return <div>Loading</div>;
};

export default withDefaultLayout(Index);
