import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { dynamoDbClient } from '../../src/instances/aws';
import { userEmails } from '../../src/services/userEmails.service';

vi.mock('../../src/instances/aws', () => ({
  s3Client: { send: vi.fn(), getSignedUrl: vi.fn() },
  dynamoDbClient: { scan: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const scan = dynamoDbClient.scan as unknown as Mock;
const put = dynamoDbClient.put as unknown as Mock;
const remove = dynamoDbClient.delete as unknown as Mock;

beforeEach(() => {
  scan.mockResolvedValue({ Items: [] });
  put.mockResolvedValue({});
  remove.mockResolvedValue({});
});

describe('userEmails.getEmails', () => {
  it('scans the user-email table filtered on the sort key', async () => {
    const items = [
      {
        pk: 'pk-1',
        sk: 'owner@example.test',
        user: 'owner@example.test',
        email: 'friend@example.test',
        description: 'a friend',
        default: true,
      },
    ];

    scan.mockResolvedValue({ Items: items });

    await expect(userEmails.getEmails('owner@example.test')).resolves.toEqual(items);

    expect(scan).toHaveBeenCalledWith({
      TableName: 'user-email',
      FilterExpression: 'sk = :e',
      ExpressionAttributeValues: { ':e': 'owner@example.test' },
    });
  });

  it('passes the raw Items through, undefined included', async () => {
    scan.mockResolvedValue({});

    await expect(userEmails.getEmails('owner@example.test')).resolves.toBeUndefined();
  });
});

describe('userEmails.addEmail', () => {
  it('stores the item with a generated pk and the user as sort key', async () => {
    await userEmails.addEmail({
      user: 'owner@example.test',
      email: 'friend@example.test',
      description: 'a friend',
      default: false,
    });

    expect(put).toHaveBeenCalledTimes(1);

    const [{ TableName, Item }] = put.mock.calls[0] as [{
      TableName: string
      Item: Record<string, unknown>
    }];

    expect(TableName).toBe('user-email');
    expect(Item).toMatchObject({
      user: 'owner@example.test',
      email: 'friend@example.test',
      description: 'a friend',
      default: false,
      sk: 'owner@example.test',
    });
    expect(typeof Item.pk).toBe('string');
    expect(Item.pk).not.toHaveLength(0);
  });

  it('generates a different pk on every call', async () => {
    await userEmails.addEmail({ user: 'a@example.test' });
    await userEmails.addEmail({ user: 'a@example.test' });

    const [first] = put.mock.calls[0] as [{ Item: { pk: string } }];
    const [second] = put.mock.calls[1] as [{ Item: { pk: string } }];

    expect(first.Item.pk).not.toBe(second.Item.pk);
  });

  it('leaves sk undefined when the item carries no user', async () => {
    await userEmails.addEmail({ email: 'orphan@example.test' });

    const [{ Item }] = put.mock.calls[0] as [{ Item: Record<string, unknown> }];

    expect(Item.sk).toBeUndefined();
  });
});

describe('userEmails.deleteEmail', () => {
  it('deletes by the composite key', async () => {
    await userEmails.deleteEmail({ pk: 'pk-1', sk: 'owner@example.test', email: 'ignored' });

    expect(remove).toHaveBeenCalledWith({
      TableName: 'user-email',
      Key: { pk: 'pk-1', sk: 'owner@example.test' },
    });
  });
});
