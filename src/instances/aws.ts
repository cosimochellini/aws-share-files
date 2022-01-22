import { env } from "./env";
import AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";
import { GenericFunction } from "../types/generic";
import { Credentials, DynamoDB, SES } from "aws-sdk";

const { region, accessKeyId, secretAccessKey } = env.aws;

const credentials = new Credentials({ accessKeyId, secretAccessKey });

AWS.config.update({ region });
AWS.config.credentials = credentials;

export const s3 = new S3({});

export const documentClient = new DynamoDB.DocumentClient({
    convertEmptyValues: true,
    convertResponseTypes: true,
});

export const proxyDocument = {
    get: (params: Param<typeof documentClient.get>) => documentClient.get(params).promise(),
    put: (params: Param<typeof documentClient.put>) => documentClient.put(params).promise(),
    delete: (params: Param<typeof documentClient.delete>) => documentClient.delete(params).promise(),
    query: (params: Param<typeof documentClient.query>) => documentClient.query(params).promise(),
    scan: (params: Param<typeof documentClient.scan>) => documentClient.scan(params).promise(),
    update: (params: Param<typeof documentClient.update>) => documentClient.update(params).promise(),
}

type Param<T extends GenericFunction> = Parameters<T>[0];

export const sesClient = new SES({});
