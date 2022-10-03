import { useRouter } from 'next/router';
import { withDefaultLayout } from '../layouts';
import { useEffectOnceWhen } from '../src/hooks/once';

function Index() {
  const router = useRouter();

  useEffectOnceWhen(() => {
    router.push('/files');
  });

  return <div>Loading</div>;
}

export default withDefaultLayout(Index);
