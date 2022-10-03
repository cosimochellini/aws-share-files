import { bucket } from '../../../src/services/bucket.service';
import { defaultBehavior } from '../../../src/utils/api/composable';

export default defaultBehavior(async (req) => {
  const { key, expires } = req.query;

  return bucket.getShareableUrl({
    key: key as string,
    expires: parseInt((expires ?? '10') as string, 10),
  });
});
