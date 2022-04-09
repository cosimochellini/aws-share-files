import { bucket } from "../../../src/services/bucket.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior((req) => {
  const { key } = req.query;

  return bucket.deleteFile(key as string);
});
