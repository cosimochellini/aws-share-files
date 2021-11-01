// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { client, smbClient } from "../../src/instances/smbClient";

type Data = {
  files?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const files = await smbClient.readdir("/");

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: error as string });
  }
}
