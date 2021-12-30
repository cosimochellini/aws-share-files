import { email } from "../../../src/services/email.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior(async function (req) {
  const { to, fileKey } = req.query;

  const data = await email.sendFile({
    to: to as string,
    fileKey: fileKey as string,
  });

  return data;
});
