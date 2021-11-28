import { env } from "../instances/env";
import { s3 } from "../instances/s3";
import { ServiceMapper } from "../types/generic";
import { S3Folder } from "../classes/S3Folder";

export const bucket = {
  async getAllFiles() {
    const s3response = await s3
      .listObjects({ Bucket: env.s3.bucket })
      .promise();

    const items = s3response.Contents ?? [];
    const folders = items.filter((x) => x.Key?.endsWith("/"));

    return folders.map((item) => new S3Folder(item, items));
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;
