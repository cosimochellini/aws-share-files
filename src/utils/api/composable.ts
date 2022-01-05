import { NextApiRequest } from "next";
import type { BaseResponse } from "../../types/generic";

export const defaultBehavior = (
  apiFn: (req: NextApiRequest, res: BaseResponse) => unknown | Promise<unknown>
) => {
  return async (req: NextApiRequest, res: BaseResponse) => {
    try {
      const ret = apiFn(req, res);

      const data = ret instanceof Promise ? await ret : ret;

      res.status(200).json(data);
    } catch (e: any) {
      const error = e.message ?? e;

      res.status(400).json({ error: error.toString() });
    }
  };
};
