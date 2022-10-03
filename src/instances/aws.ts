import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from './env';

const { region, accessKeyId, secretAccessKey } = env.aws;

const credentials = { accessKeyId, secretAccessKey };

export const dynamoDbClient = DynamoDBDocument.from(
  new DynamoDB({ credentials, region }),
  {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  },
);

class TypedS3Client extends S3Client {
  getSignedUrl(key: string, expiresIn: number) {
    const command = new GetObjectCommand({ Bucket: env.aws.bucket, Key: key });

    return getSignedUrl(this, command, { expiresIn });
  }
}

export const s3Client = new TypedS3Client({ credentials, region });
