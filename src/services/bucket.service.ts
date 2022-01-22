import { s3 } from "../instances/aws";
import { env } from "../instances/env";
import { byValue, byString } from "sort-es";
import { S3Folder } from "../classes/S3Folder";
import { ServiceArguments, ServiceMapper } from "../types/generic";

export type uploadPayload = {
  file: File | Buffer;
  name: string;
  author: string;
  extension: string;
};

export const bucket = {
  async getAllFiles() {
    const s3response = await s3
      .listObjects({ Bucket: env.aws.bucket })
      .promise();

    const items = s3response.Contents ?? [];

    return items
      .filter((x) => x.Key?.endsWith("/"))
      .map((item) => new S3Folder(item, items))
      .sort(byValue((x) => x.FolderName, byString()));
  },

  getShareableUrl({ key, expires = 10 }: { key: string; expires?: number }) {
    const url = s3.getSignedUrl("getObject", {
      Key: key,
      Expires: expires,
      Bucket: env.aws.bucket,
    });

    return {
      signedUrl: url,
    };
  },

  async downloadFile(key: string) {
    const s3Object = s3.getObject({
      Bucket: env.aws.bucket,
      Key: key,
    });

    return {
      key: key,
      promise: () => s3Object.promise(),
      stream: () => s3Object.createReadStream(),
    };
  },

  async uploadFile(payload: uploadPayload) {
    const { file, name, author, extension } = payload;

    const key = `${author}/${name}.${extension}`;

    await this.createFolder(author);

    const s3Object = s3.upload({
      Key: key,
      Body: file,
      Bucket: env.aws.bucket,
    });

    return s3Object.promise();
  },

  async createFolder(folderName: string) {
    const exists = await this.folderExists(folderName);

    if (exists) return;

    const s3Object = s3.putObject({
      Bucket: env.aws.bucket,
      Key: `${folderName}/`,
    });

    await s3Object.promise();
  },

  async folderExists(folderName: string) {
    const s3response = await s3
      .listObjects({ Bucket: env.aws.bucket, Prefix: folderName })
      .promise();

    return !!s3response.Contents?.length;
  },

  deleteFile(key: string) {
    const s3Object = s3.deleteObject({
      Bucket: env.aws.bucket,
      Key: key,
    });

    return s3Object.promise();
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;

export type bucketArgs = ServiceArguments<typeof bucket>;
