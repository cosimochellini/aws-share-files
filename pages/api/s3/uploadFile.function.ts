import { fileHandler } from '../../../src/utils/api/fileHandler';
import { defaultBehavior } from '../../../src/utils/api/composable';
import type { UploadPayload } from '../../../src/services/bucket.service';
import { bucket } from '../../../src/services/bucket.service';

export default defaultBehavior(async (req) => {
  const { body, getFile } = await fileHandler<UploadPayload>(req);

  const file = await getFile();

  return bucket.uploadFile({
    ...body,
    file,
  });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
