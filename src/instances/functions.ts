import { caller } from "../utils/functionCaller";
import { bucketTypes } from "../../src/services/bucket.service";

export const functions = {
  s3: {
    get root() {
      return caller<bucketTypes["getAllFiles"]>("s3/root.function");
    },
  },
};
