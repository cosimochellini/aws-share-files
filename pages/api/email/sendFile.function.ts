import { email } from "../../../src/services/email.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior(async function (req) {
  const { to, key } = req.query;

  const data = await email.sendFile(to as string, key as string);

  return data;
});
