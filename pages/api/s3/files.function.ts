import { NextApiRequest } from "next";
import { BaseResponse } from "../../../src/types/generic";
import { bucket, bucketTypes } from "../../../src/services/bucket.service";

export default async function handler(
  req: NextApiRequest,
  res: BaseResponse<bucketTypes["getAllFiles"]>
) {
  res.status(200).json(await bucket.getAllFiles());
}
