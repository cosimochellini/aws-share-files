import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../src/instances/env";
import { s3 } from "../../../src/instances/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Call S3 to obtain a list of the objects in the bucket
  const s3response = await s3.listObjects({ Bucket: env.s3.bucket }).promise();

  res.status(200).json(s3response);
}
