import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const dynamoDbInstance = { marker: 'dynamodb-instance' };
  const documentInstance = { marker: 'document-instance' };

  class GetObjectCommandMock {
    constructor(public input: unknown) {}
  }

  // TypedS3Client extends this, so it has to be a real, extendable class.
  class S3ClientMock {
    constructor(public config: unknown) {}
  }

  // src/instances/aws.ts calls `new DynamoDB(...)`, and Vitest 4 refuses to construct an
  // arrow function. A function expression returning an object still overrides `this`, so
  // `new` keeps handing back the same fixed instance the assertions below match on.
  const dynamoDbFactory = function DynamoDBMock() {
    return dynamoDbInstance;
  };

  return {
    dynamoDbInstance,
    documentInstance,
    GetObjectCommandMock,
    S3ClientMock,
    dynamoDbFactory,
    DynamoDB: vi.fn(dynamoDbFactory),
    from: vi.fn(() => documentInstance),
    getSignedUrl: vi.fn(() => Promise.resolve('https://signed.example.test/object')),
  };
});

vi.mock('@aws-sdk/client-dynamodb', () => ({ DynamoDB: mocks.DynamoDB }));

vi.mock('@aws-sdk/lib-dynamodb', () => ({ DynamoDBDocument: { from: mocks.from } }));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: mocks.S3ClientMock,
  GetObjectCommand: mocks.GetObjectCommandMock,
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: mocks.getSignedUrl }));

const credentials = {
  accessKeyId: 'test-access-key-id',
  secretAccessKey: 'test-secret-access-key',
};

/**
 * `clearMocks` wipes the call history before every test, so the module has to be
 * re-evaluated inside each test for the import-time wiring to be observable.
 */
const importAws = () => {
  vi.resetModules();

  return import('../../src/instances/aws');
};

beforeEach(() => {
  mocks.DynamoDB.mockImplementation(mocks.dynamoDbFactory);
  mocks.from.mockReturnValue(mocks.documentInstance);
  mocks.getSignedUrl.mockResolvedValue('https://signed.example.test/object');
});

describe('dynamoDbClient', () => {
  it('builds the DynamoDB client with the env credentials and region', async () => {
    await importAws();

    expect(mocks.DynamoDB).toHaveBeenCalledTimes(1);
    expect(mocks.DynamoDB).toHaveBeenCalledWith({ credentials, region: 'eu-south-1' });
  });

  it('wraps it in a document client with the marshalling options', async () => {
    const { dynamoDbClient } = await importAws();

    expect(mocks.from).toHaveBeenCalledWith(mocks.dynamoDbInstance, {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });

    expect(dynamoDbClient).toBe(mocks.documentInstance);
  });
});

describe('s3Client', () => {
  it('is constructed with the env credentials and region', async () => {
    const { s3Client } = await importAws();

    expect(s3Client).toBeInstanceOf(mocks.S3ClientMock);
    expect((s3Client as unknown as { config: unknown }).config).toEqual({
      credentials,
      region: 'eu-south-1',
    });
  });

  it('presigns a GetObjectCommand for the configured bucket', async () => {
    const { s3Client } = await importAws();

    await expect(s3Client.getSignedUrl('author/book.pdf', 60))
      .resolves.toBe('https://signed.example.test/object');

    expect(mocks.getSignedUrl).toHaveBeenCalledTimes(1);

    const [client, command, options] = mocks.getSignedUrl.mock.calls[0] as unknown as [
      unknown,
      { input: unknown },
      unknown,
    ];

    expect(client).toBe(s3Client);
    expect(command).toBeInstanceOf(mocks.GetObjectCommandMock);
    expect(command.input).toEqual({ Bucket: 'test-bucket', Key: 'author/book.pdf' });
    expect(options).toEqual({ expiresIn: 60 });
  });

  it('builds a fresh command for every call', async () => {
    const { s3Client } = await importAws();

    await s3Client.getSignedUrl('a', 1);
    await s3Client.getSignedUrl('b', 2);

    const [firstCall, secondCall] = mocks.getSignedUrl.mock.calls as unknown as [
      [unknown, { input: unknown }, unknown],
      [unknown, { input: unknown }, unknown],
    ];

    expect(firstCall[1].input).toEqual({ Bucket: 'test-bucket', Key: 'a' });
    expect(firstCall[2]).toEqual({ expiresIn: 1 });
    expect(secondCall[1].input).toEqual({ Bucket: 'test-bucket', Key: 'b' });
    expect(secondCall[2]).toEqual({ expiresIn: 2 });
    expect(firstCall[1]).not.toBe(secondCall[1]);
  });
});
