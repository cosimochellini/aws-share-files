import { env } from "./env";
import AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";
import { Credentials, DynamoDB } from "aws-sdk";

const { region, accessKeyId, secretAccessKey } = env.aws;

const credentials = new Credentials({ accessKeyId, secretAccessKey });

AWS.config.update({ region });
AWS.config.credentials = credentials;

export const s3 = new S3({});

export const documentClient = new DynamoDB.DocumentClient({
  convertEmptyValues: true,
  convertResponseTypes: true,
});
