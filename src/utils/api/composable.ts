import type { NextApiResponse } from "next";

export const handleError = async (
  res: NextApiResponse<unknown>,
  apiFn: () => unknown | Promise<unknown>
) => {
  try {
    const ret = apiFn();

    if (!(ret instanceof Promise)) return;

    await ret;
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? e });
  }
};
