import { s3 } from "../instances/s3";
import { env } from "../instances/env";
import { byValue, byString } from "sort-es";
import { S3Folder } from "../classes/S3Folder";
import { ServiceMapper } from "../types/generic";

export const bucket = {
  async getAllFiles() {
    const s3response = await s3
      .listObjects({ Bucket: env.s3.bucket })
      .promise();

    const items = s3response.Contents ?? [];

    return items
      .filter((x) => x.Key?.endsWith("/"))
      .map((item) => new S3Folder(item, items))
      .sort(byValue("FolderName", byString()));
  },

  async downloadFile(key: string) {
    return s3
      .getObject({
        Bucket: env.s3.bucket,
        Key: key,
      })
      .createReadStream();
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;
