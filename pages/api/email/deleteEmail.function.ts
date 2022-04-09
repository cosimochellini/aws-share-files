import { UserEmail } from "../../../src/types/dynamo.types";
import { defaultBehavior } from "../../../src/utils/api/composable";
import { userEmails } from "../../../src/services/userEmails.service";

export default defaultBehavior(async function (req) {
    const { item } = req.body;

    const data = await userEmails.deleteEmail(item as UserEmail);

    return data;
});
