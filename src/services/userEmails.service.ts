import { randomId } from '../utils/random';
import { dynamoDbClient } from '../instances/aws';
import { UserEmail } from '../types/dynamo.types';
import { ServiceArguments, ServiceMapper } from '../types/generic';

const TableName = 'user-email';

export const userEmails = {
  getEmails(userEmail: string) {
    return dynamoDbClient
      .scan({
        TableName,
        FilterExpression: 'sk = :e',
        ExpressionAttributeValues: { ':e': userEmail },
      })
      .then((x) => x.Items as UserEmail[]);
  },

  addEmail(item: Partial<UserEmail>) {
    const Item = { ...item, pk: randomId(), sk: item.user };

    return dynamoDbClient.put({ TableName, Item });
  },

  deleteEmail(item: Partial<UserEmail>) {
    return dynamoDbClient.delete({
      TableName,
      Key: { pk: item.pk, sk: item.sk },
    });
  },
};

export type userEmailsType = ServiceMapper<typeof userEmails>;

export type userEmailsArgs = ServiceArguments<typeof userEmails>;
