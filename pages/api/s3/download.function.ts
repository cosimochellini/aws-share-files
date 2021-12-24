import { NextApiRequest } from "next";
import { BaseResponse } from "../../../src/types/generic";
import { bucket } from "../../../src/services/bucket.service";

export default async function handler(req: NextApiRequest, res: BaseResponse) {
  const { key } = req.query;
  const [, title] = (key as string).split("/");
  const [, extension] = title.split(".");

  const item = await bucket.downloadFile(key as string);

  res.writeHead(200, {
    "Content-Type": `application/${extension}`,
    "Content-Disposition": `attachment; filename=${title}`,
  }); // or whatever your logic needs

  item.stream().pipe(res);
}
