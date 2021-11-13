import { NextApiRequest, NextApiResponse } from "next";
import { bucket, bucketTypes } from "../../../src/services/bucket.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<bucketTypes["getAllFiles"]>
) {
  res.status(200).json(await bucket.getAllFiles());
}
