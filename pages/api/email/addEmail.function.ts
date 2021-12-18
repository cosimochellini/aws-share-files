import { NextApiRequest } from "next";
import {
  userEmails,
  userEmailsType,
} from "../../../src/services/userEmails.service";
import { UserEmail } from "../../../src/types/dynamo.types";
import { BaseResponse } from "../../../src/types/generic";
import { handleError } from "../../../src/utils/api/composable";

export default async function handler(
  req: NextApiRequest,
  res: BaseResponse<userEmailsType["addEmail"]>
) {
  const { item } = req.body;

  const data = await handleError(res, () =>
    userEmails.addEmail(item as UserEmail)
  );

  res.status(200).json(data);
}
