import { env } from "./env";
import AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

const { region, bucket: Bucket, accessKeyId, secretAccessKey } = env.s3;

const credentials = new AWS.Credentials({
  accessKeyId,
  secretAccessKey,
});

AWS.config.update({ region });
AWS.config.credentials = credentials;

export const bucketParams: S3.Types.ListObjectsRequest = { Bucket };

export const s3 = new S3({});
