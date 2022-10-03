import { defaultBehavior } from '../../src/utils/api/composable';

export default defaultBehavior((req) => {
  const { query } = req.query;

  return { query };
});
