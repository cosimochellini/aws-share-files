import { NextApiRequest } from "next";
import { BaseResponse } from "../../../src/types/generic";
import {
  bucket,
  bucketTypes,
  uploadPayload,
} from "../../../src/services/bucket.service";
import { fileHandler } from "../../../src/utils/api/fileHandler";
import { handleError } from "../../../src/utils/api/composable";

export default async function handler(
  req: NextApiRequest,
  res: BaseResponse<bucketTypes["uploadFile"]>
) {
  const data = await handleError(res, async () => {
    const { body, getFile } = await fileHandler<uploadPayload>(req);

    const file = await getFile();

    return await bucket.uploadFile({ ...body, file });
  });

  res.status(200).json(data);
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
