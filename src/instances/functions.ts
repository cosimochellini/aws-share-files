import { caller } from "../utils/functionCaller";
import { bucketTypes } from "../../src/services/bucket.service";
import { AwaitedServiceMapper, ServiceMapper } from "../types/generic";

export const functions = {
  s3: {
    root() {
      return caller<bucketTypes["getAllFiles"]>("s3/root.function");
    },
  },
};

export type FunctionTypes = ServiceMapper<typeof functions>;
export type AwaitedFunctionTypes = AwaitedServiceMapper<FunctionTypes>;
