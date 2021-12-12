import { s3 } from "../instances/aws";
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
      .sort(byValue((x) => x.FolderName, byString()));
  },

  async downloadFile(key: string) {
    const s3Object = s3.getObject({
      Bucket: env.s3.bucket,
      Key: key,
    });

    return {
      key: key,
      promise: () => s3Object.promise(),
      stream: () => s3Object.createReadStream(),
    };
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;
