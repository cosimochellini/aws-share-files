import { defaultBehavior } from "../../../src/utils/api/composable";
import { userEmails } from "../../../src/services/userEmails.service";

export default defaultBehavior(async function (req) {
  const { userEmail } = req.query;

  const data = await userEmails.getEmails(userEmail as string);

  return data;
});
