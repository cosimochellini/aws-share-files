import { trowIfNull } from "../../../src/utils/throw";
import { UserEmail } from "../../../src/types/dynamo.types";
import { defaultBehavior } from "../../../src/utils/api/composable";
import { userEmails } from "../../../src/services/userEmails.service";

export default defaultBehavior(async function (req, res, session) {
    const { item } = req.body;

    const user = trowIfNull(session?.user?.email);

    const userEmail = { ...item, user } as UserEmail;

    const _ = await userEmails.addEmail(userEmail);

    return userEmail;

}, { shouldAuthenticate: true });
