import { NextApiRequest, NextApiResponse } from "next";
import { email } from "../../../src/services/email.service";
import { handleError } from "../../../src/utils/api/composable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email: to, subject, text } = req.body;

  const data = await handleError(res, () =>
    email.sendEmail("cosimo.chellini@gmail.com")
  );

  res.status(200).json({ data });
}
