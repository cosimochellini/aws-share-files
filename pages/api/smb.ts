// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { client, smbClient } from "../../src/instances/smbClient";

type Data = {
  files?: string[];
  error1?: string;
  error2?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const files = await smbClient.readdir("/mnt2/dati");

    res.status(200).json({ files });
  } catch (error) {
    try {
      const files = (await client.list("")) as any as string[];
      res.status(200).json({ files });
    } catch (error2) {
      res
        .status(500)
        .json({ error1: error as string, error2: error2 as string });
    }
  }
}
