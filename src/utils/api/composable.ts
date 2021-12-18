import type { BaseResponse } from "../../types/generic";

export const handleError = async <T, K>(
  res: BaseResponse<K>,
  apiFn: () => T | Promise<T>
) => {
  try {
    const ret = apiFn();

    if (!(ret instanceof Promise)) return ret;

    return await ret;
  } catch (e: any) {
    const error = (e.message ?? e) as string;

    res.status(500).json({ error });

    throw e;
  }
};
