import { fileHandler } from '../../../src/utils/api/fileHandler';
import { defaultBehavior } from '../../../src/utils/api/composable';
import { bucket, UploadPayload } from '../../../src/services/bucket.service';

export default defaultBehavior(async (req) => {
  const { body, getFile } = await fileHandler<UploadPayload>(req);

  const file = await getFile();
  const data = await bucket.uploadFile({ ...body, file });

  return data;
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
