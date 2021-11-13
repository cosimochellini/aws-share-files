import { env } from "../../src/instances/env";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof env>
) {
  res.status(200).json(env);
}
