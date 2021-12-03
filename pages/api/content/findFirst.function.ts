import { NextApiRequest, NextApiResponse } from "next";
import { content, contentTypes } from "../../../src/services/content.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<contentTypes["findFirstContent"]>
) {
  const { query } = req.query;

  res.status(200).json(await content.findFirstContent(query as string));
}
