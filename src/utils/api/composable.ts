import type { NextApiResponse } from "next";

export const handleError = async <T>(
  res: NextApiResponse<unknown>,
  apiFn: () => T | Promise<T>
) => {
  try {
    const ret = apiFn();

    if (!(ret instanceof Promise)) return ret;

    return await ret;
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? e });

    throw e;
  }
};
