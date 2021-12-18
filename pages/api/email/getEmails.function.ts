import { NextApiRequest } from "next";
import { handleError } from "../../../src/utils/api/composable";
import {
  userEmails,
  userEmailsType,
} from "../../../src/services/userEmails.service";

import { BaseResponse } from "../../../src/types/generic";

export default async function handler(
  req: NextApiRequest,
  res: BaseResponse<userEmailsType["getEmails"]>
) {
  const { userEmail } = req.query;

  const data = await handleError(res, () =>
    userEmails.getEmails(userEmail as string)
  );

  res.status(200).json(data);
}
