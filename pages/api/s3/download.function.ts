import { NextApiRequest, NextApiResponse } from "next";
import { bucket, bucketTypes } from "../../../src/services/bucket.service";
import { handleError } from "../../../src/utils/api/composable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handleError(res, async () => {
    const { key } = req.query;
    const title = (key as string).split("/")[1];
    const [, extension] = title.split(".");

    const item = await bucket.downloadFile(key as string);

    res.writeHead(200, {
      "Content-Type": `application/${extension}`,
      "Content-Disposition": `attachment; filename=${title}`,
    }); // or whatever your logic needs

    item.pipe(res);
  });
}
