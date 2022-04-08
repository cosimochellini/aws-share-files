import { caller } from "../utils/functionCaller";
import type { AwaitedServiceMapper, ServiceMapper } from "../types/generic";
import type { emailArguments, emailTypes } from "../services/email.service";
import type { contentArgs, contentTypes } from "../services/content.service";
import type { bucketArgs, bucketTypes } from "../../src/services/bucket.service";
import type { converterArgs, converterTypes } from "../services/converter.service";
import type { userEmailsArgs, userEmailsType } from "../services/userEmails.service";

export const functions = {
    s3: {
        files() {
            return caller<bucketTypes["getAllFiles"]>("s3/files.function");
        },
        uploadFile(payload: bucketArgs["uploadFile"]) {
            return caller.formData<bucketTypes["uploadFile"]>("s3/uploadFile.function", payload);
        },
        shareableUrl(req: bucketArgs["getShareableUrl"]) {
            return caller<bucketTypes["getShareableUrl"]>("s3/shareableUrl.function", req);
        },
        deleteFile(key: bucketArgs["deleteFile"]) {
            return caller<bucketTypes["deleteFile"]>("s3/deleteFile.function", { key, });
        },
    },

    content: {
        findFirst(query: contentArgs["findFirstContent"]) {
            return caller<contentTypes["findFirstContent"]>("content/findFirst.function", { query });
        },
        findAllContent(query: contentArgs["findAllContent"]) {
            return caller<contentTypes["findAllContent"]>("content/findAll.function", { query });
        },
    },

    email: {
        sendFile(query: emailArguments["sendFile"]) {
            return caller<emailTypes["sendFile"]>("email/sendFile.function", query);
        },
        getEmails() {
            return caller<userEmailsType["getEmails"]>("email/getEmails.function", {});
        },
        addEmail(item: userEmailsArgs["addEmail"]) {
            return caller.post<userEmailsType["addEmail"]>("email/addEmail.function", { item });
        },
        deleteEmail(item: userEmailsArgs["deleteEmail"]) {
            return caller.post<userEmailsType["deleteEmail"]>("email/deleteEmail.function", { item });
        },
    },

    convert: {
        getConversionStatus(id: converterArgs["getConversionStatus"]) {
            return caller<converterTypes["getConversionStatus"]>("converter/getConversion.function", { id });
        },
        convert({ file, target }: converterArgs["convertFile"]) {
            return caller<converterTypes["convertFile"]>("converter/convert.function", { file, target });
        },
    },
};

export type FunctionTypes = ServiceMapper<typeof functions>;
export type AwaitedFunctionTypes = AwaitedServiceMapper<FunctionTypes>;
