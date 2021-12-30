import { caller } from "../utils/functionCaller";
import { AwaitedServiceMapper, ServiceMapper } from "../types/generic";
import { emailArguments, emailTypes } from "../services/email.service";
import { contentArgs, contentTypes } from "../services/content.service";
import { bucketArgs, bucketTypes } from "../../src/services/bucket.service";
import { converterArgs, converterTypes } from "../services/converter.service";
import { userEmailsArgs, userEmailsType } from "../services/userEmails.service";

export const functions = {
  s3: {
    files() {
      return caller<bucketTypes["getAllFiles"]>("s3/files.function");
    },
    downloadFile(key: bucketArgs["downloadFile"]) {
      return caller<bucketTypes["downloadFile"]>("s3/downloadFile.function", {
        key,
      });
    },
    uploadFile(payload: bucketArgs["uploadFile"]) {
      return caller.formData<bucketTypes["uploadFile"]>(
        "s3/uploadFile.function",
        payload
      );
    },
  },

  content: {
    findFirst(query: contentArgs["findFirstContent"]) {
      return caller<contentTypes["findFirstContent"]>(
        "content/findFirst.function",
        { query }
      );
    },
    findAllContent(query: contentArgs["findAllContent"]) {
      return caller<contentTypes["findAllContent"]>(
        "content/findAll.function",
        { query }
      );
    },
  },

  email: {
    sendFile({ to, fileKey }: emailArguments["sendFile"]) {
      const query = { to, fileKey };
      return caller<emailTypes["sendFile"]>("email/sendFile.function", query);
    },
    getEmails(userEmail: userEmailsArgs["getEmails"]) {
      return caller<userEmailsType["getEmails"]>("email/getEmails.function", {
        userEmail,
      });
    },
    addEmail(item: userEmailsArgs["addEmail"]) {
      return caller.post<userEmailsType["addEmail"]>(
        "email/addEmail.function",
        { item: { ...item, user: "cosimo.chellini@gmail.com" } }
      );
    },
    deleteEmail(item: userEmailsArgs["deleteEmail"]) {
      return caller.post<userEmailsType["deleteEmail"]>(
        "email/deleteEmail.function",
        { item }
      );
    },
  },

  convert: {
    getConversionStatus(id: converterArgs["getConversionStatus"]) {
      return caller<converterTypes["getConversionStatus"]>(
        "converter/getConversionStatus.function",
        { id }
      );
    },
    convert({ file, target }: converterArgs["convertFile"]) {
      return caller<converterTypes["convertFile"]>(
        "converter/convert.function",
        { file, target }
      );
    },
  },
};

export type FunctionTypes = ServiceMapper<typeof functions>;
export type AwaitedFunctionTypes = AwaitedServiceMapper<FunctionTypes>;
