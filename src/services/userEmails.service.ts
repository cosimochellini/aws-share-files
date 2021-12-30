import { randomId } from "../utils/random";
import { ServiceArguments, ServiceMapper } from "../types/generic";
import { documentClient } from "../instances/aws";
import { UserEmail } from "../types/dynamo.types";

const TableName = "user-email";

export const userEmails = {
  getEmails(userEmail: string) {
    return documentClient
      .scan({
        TableName,
        FilterExpression: "sk = :e",
        ExpressionAttributeValues: { ":e": userEmail },
      })
      .promise()
      .then((x) => x.Items as UserEmail[]);
  },

  addEmail(item: Partial<UserEmail>) {
    item.pk = randomId();
    item.sk = item.user;

    return documentClient.put({ TableName, Item: item }).promise();
  },

  deleteEmail(item: Partial<UserEmail>) {
    return documentClient
      .delete({
        TableName,
        Key: { pk: item.pk, sk: item.sk },
      })
      .promise();
  },
};

export type userEmailsType = ServiceMapper<typeof userEmails>;

export type userEmailsArgs = ServiceArguments<typeof userEmails>;
