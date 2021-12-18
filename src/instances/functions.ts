import { caller } from "../utils/functionCaller";
import { UserEmail } from "../types/dynamo.types";
import { emailTypes } from "../services/email.service";
import { contentTypes } from "../services/content.service";
import { bucketTypes } from "../../src/services/bucket.service";
import { userEmailsType } from "../services/userEmails.service";
import { AwaitedServiceMapper, ServiceMapper } from "../types/generic";

export const functions = {
  s3: {
    root() {
      return caller<bucketTypes["getAllFiles"]>("s3/root.function");
    },
    downloadFile(key: string) {
      return caller<bucketTypes["downloadFile"]>("s3/downloadFile.function", {
        key,
      });
    },
  },
  content: {
    findFirst(query: string) {
      return caller<contentTypes["findFirstContent"]>(
        "content/findFirst.function",
        { query }
      );
    },
  },
  email: {
    sendFile(to: string, key: string) {
      const query = { to, key };
      return caller<emailTypes["sendFile"]>("email/sendFile.function", query);
    },
    getEmails(userEmail: string) {
      return caller<userEmailsType["getEmails"]>("email/getEmails.function", {
        userEmail,
      });
    },
    addEmail(item: Partial<UserEmail>) {
      return caller.post<userEmailsType["addEmail"]>(
        "email/addEmail.function",
        { item: { ...item, user: "cosimo.chellini@gmail.com" } }
      );
    },
    deleteEmail(item: UserEmail) {
      return caller.post<userEmailsType["deleteEmail"]>(
        "email/deleteEmail.function",
        { item }
      );
    },
  },
};

export type FunctionTypes = ServiceMapper<typeof functions>;
export type AwaitedFunctionTypes = AwaitedServiceMapper<FunctionTypes>;
