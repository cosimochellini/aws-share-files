import { NextApiRequest, NextApiResponse } from "next";
import { email } from "../../../src/services/email.service";
import { handleError } from "../../../src/utils/api/composable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to, key } = req.query;

  const data = await handleError(res, () =>
    email.sendFile(to as string, key as string)
  );

  res.status(200).json({ data });
}
