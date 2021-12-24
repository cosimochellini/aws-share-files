import { functions } from "../instances/functions";

export const file = {
  uploadFile(payload: uploadPayload) {
    return functions.s3.uploadFile(payload);
  },
};
