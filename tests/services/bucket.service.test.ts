import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';

import { S3Folder } from '../../src/classes/S3Folder';
import { s3Client } from '../../src/instances/aws';
import { bucket } from '../../src/services/bucket.service';

vi.mock('../../src/instances/aws', () => ({
  s3Client: { send: vi.fn(), getSignedUrl: vi.fn() },
  dynamoDbClient: { scan: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const send = s3Client.send as unknown as Mock;
const getSignedUrl = s3Client.getSignedUrl as unknown as Mock;

const sentCommands = () => send.mock.calls.map((call) => call[0]);

beforeEach(() => {
  send.mockResolvedValue({});
  getSignedUrl.mockResolvedValue('https://signed.example.test/file');
});

describe('bucket.getAllFiles', () => {
  it('lists the configured bucket and groups the objects into folders', async () => {
    send.mockResolvedValue({
      Contents: [
        { Key: 'author/', Size: 0 },
        { Key: 'author/first.pdf', Size: 10 },
        { Key: 'author/second.pdf', Size: 20 },
        { Key: 'other/third.epub', Size: 30 },
      ],
    });

    const folders = await bucket.getAllFiles();

    const [command] = sentCommands();
    expect(command).toBeInstanceOf(ListObjectsV2Command);
    expect((command as ListObjectsV2Command).input).toEqual({ Bucket: 'test-bucket' });

    expect(folders).toHaveLength(2);
    expect(folders.every((folder) => folder instanceof S3Folder)).toBe(true);
    expect(folders.map((folder) => folder.FolderName)).toEqual(['author', 'other']);
    expect(folders[0]?.Files).toHaveLength(2);
    expect(folders[1]?.Files).toHaveLength(1);
  });

  it('returns an empty list when the response has no Contents', async () => {
    send.mockResolvedValue({});

    await expect(bucket.getAllFiles()).resolves.toEqual([]);
  });
});

describe('bucket.getShareableUrl', () => {
  it('delegates to the presigning client with the given expiry', async () => {
    await expect(bucket.getShareableUrl({ key: 'author/book.pdf', expires: 60 }))
      .resolves.toBe('https://signed.example.test/file');

    expect(getSignedUrl).toHaveBeenCalledWith('author/book.pdf', 60);
  });

  it('defaults the expiry to 10', async () => {
    await bucket.getShareableUrl({ key: 'author/book.pdf' });

    expect(getSignedUrl).toHaveBeenCalledWith('author/book.pdf', 10);
  });
});

describe('bucket.folderExists', () => {
  it('is true when the prefix returns at least one object', async () => {
    send.mockResolvedValue({ Contents: [{ Key: 'author/book.pdf' }] });

    await expect(bucket.folderExists('author')).resolves.toBe(true);

    const [command] = sentCommands();
    expect(command).toBeInstanceOf(ListObjectsV2Command);
    expect((command as ListObjectsV2Command).input).toEqual({
      Prefix: 'author',
      Bucket: 'test-bucket',
    });
  });

  it('is false when the prefix returns an empty Contents array', async () => {
    send.mockResolvedValue({ Contents: [] });

    await expect(bucket.folderExists('author')).resolves.toBe(false);
  });

  it('is false when Contents is missing entirely', async () => {
    send.mockResolvedValue({});

    await expect(bucket.folderExists('author')).resolves.toBe(false);
  });
});

describe('bucket.createFolder', () => {
  it('puts a folder marker object when the folder is missing', async () => {
    send.mockResolvedValue({ Contents: [] });

    await bucket.createFolder('author');

    const commands = sentCommands();
    expect(commands).toHaveLength(2);
    expect(commands[1]).toBeInstanceOf(PutObjectCommand);
    expect((commands[1] as PutObjectCommand).input).toEqual({
      Key: 'author/',
      Bucket: 'test-bucket',
    });
  });

  it('early-returns without writing anything when the folder already exists', async () => {
    send.mockResolvedValue({ Contents: [{ Key: 'author/book.pdf' }] });

    await bucket.createFolder('author');

    expect(sentCommands()).toHaveLength(1);
    expect(send).toHaveBeenCalledTimes(1);
  });
});

describe('bucket.uploadFile', () => {
  const payload = {
    name: 'book',
    author: 'author',
    extension: 'pdf',
    file: Buffer.from('content'),
  };

  it('creates the folder first when it does not exist yet', async () => {
    send.mockResolvedValue({ Contents: [] });

    await bucket.uploadFile(payload);

    const commands = sentCommands();
    expect(commands).toHaveLength(3);
    expect(commands[0]).toBeInstanceOf(ListObjectsV2Command);
    expect((commands[1] as PutObjectCommand).input).toEqual({
      Key: 'author/',
      Bucket: 'test-bucket',
    });
    expect((commands[2] as PutObjectCommand).input).toEqual({
      Key: 'author/book.pdf',
      Body: payload.file,
      Bucket: 'test-bucket',
    });
  });

  it('skips the folder marker when the folder already exists', async () => {
    send.mockResolvedValue({ Contents: [{ Key: 'author/other.pdf' }] });

    await bucket.uploadFile(payload);

    const commands = sentCommands();
    expect(commands).toHaveLength(2);
    expect(commands[1]).toBeInstanceOf(PutObjectCommand);
    expect((commands[1] as PutObjectCommand).input).toEqual({
      Key: 'author/book.pdf',
      Body: payload.file,
      Bucket: 'test-bucket',
    });
  });

  it('returns whatever the s3 client resolves with', async () => {
    send.mockResolvedValue({ Contents: [{ Key: 'author/other.pdf' }], ETag: 'etag' });

    await expect(bucket.uploadFile(payload)).resolves.toEqual({
      Contents: [{ Key: 'author/other.pdf' }],
      ETag: 'etag',
    });
  });
});

describe('bucket.deleteFile', () => {
  it('sends a DeleteObjectCommand for the given key', async () => {
    await bucket.deleteFile('author/book.pdf');

    const [command] = sentCommands();
    expect(command).toBeInstanceOf(DeleteObjectCommand);
    expect((command as DeleteObjectCommand).input).toEqual({
      Key: 'author/book.pdf',
      Bucket: 'test-bucket',
    });
  });
});
