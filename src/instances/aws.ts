import { env } from "./env";
import AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";
import { Credentials, DynamoDB } from "aws-sdk";

const { region, accessKeyId, secretAccessKey } = env.s3;

const credentials = new Credentials({ accessKeyId, secretAccessKey });

AWS.config.update({ region });
AWS.config.credentials = credentials;

export const s3 = new S3({});

export const DocumentClient = new DynamoDB.DocumentClient({
  region,
  credentials,
  convertEmptyValues: true,
  convertResponseTypes: true,
});

const tryy = async () => {
  const r = await DocumentClient.scan({ TableName: "users" }).promise();
  console.log(r);
};

tryy().then(console.log).catch(console.error);
