import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

import { env } from '../instances/env';
import { s3Client } from '../instances/aws';
import { S3Folder } from '../classes/S3Folder';
import type { ServiceArguments, ServiceMapper } from '../types/generic';

export type UploadPayload = {
  name: string;
  author: string;
  extension: string;
  file: File | Buffer;
};

export const bucket = {
  async getAllFiles() {
    const command = new ListObjectsV2Command({ Bucket: env.aws.bucket });

    const items = (await s3Client.send(command)).Contents ?? [];

    return S3Folder.Create(items);
  },

  getShareableUrl({ key, expires = 10 }: { key: string; expires?: number }) {
    return s3Client.getSignedUrl(key, expires);
  },

  async uploadFile(payload: UploadPayload) {
    const {
      file, name, author, extension,
    } = payload;

    const key = `${author}/${name}.${extension}`;

    await this.createFolder(author);

    const command = new PutObjectCommand({
      Key: key,
      Body: file,
      Bucket: env.aws.bucket,
    });

    return s3Client.send(command);
  },

  async createFolder(folderName: string) {
    const exists = await this.folderExists(folderName);

    if (exists) return;

    const command = new PutObjectCommand({
      Key: `${folderName}/`,
      Bucket: env.aws.bucket,
    });

    await s3Client.send(command);
  },

  async folderExists(folderName: string) {
    const command = new ListObjectsV2Command({
      Prefix: folderName,
      Bucket: env.aws.bucket,
    });

    const s3response = await s3Client.send(command);

    return !!s3response.Contents?.length;
  },

  deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: env.aws.bucket,
    });

    return s3Client.send(command);
  },
};

export type bucketTypes = ServiceMapper<typeof bucket>;

export type bucketArgs = ServiceArguments<typeof bucket>;
