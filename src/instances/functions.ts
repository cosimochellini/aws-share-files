import { caller } from "../utils/functionCaller";
import { contentTypes } from "../services/content.service";
import { bucketTypes } from "../../src/services/bucket.service";
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
};

export type FunctionTypes = ServiceMapper<typeof functions>;
export type AwaitedFunctionTypes = AwaitedServiceMapper<FunctionTypes>;
