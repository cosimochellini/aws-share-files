import { trowIfNull } from '../../../src/utils/throw';
import { defaultBehavior } from '../../../src/utils/api/composable';
import { userEmails } from '../../../src/services/userEmails.service';

export default defaultBehavior(async (req, res, session) => {
  const email = trowIfNull(session?.user?.email);

  const data = await userEmails.getEmails(email);

  return data;
});
