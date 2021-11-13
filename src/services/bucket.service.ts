import { env } from "../instances/env";
import { s3 } from "../instances/s3";
import { S3Content } from "../classes/S3Content";
import { ServiceMapper } from "../types/generic";

export const bucket = {
  async getAllFiles() {
    const s3response = await s3
      .listObjects({ Bucket: env.s3.bucket })
      .promise();

    const items = s3response.Contents ?? [];

    return items.map((item) => new S3Content(item, items));
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;
