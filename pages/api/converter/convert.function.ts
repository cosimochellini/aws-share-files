import { converter } from "../../../src/services/converter.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior(async function (req) {
  const { file, target } = req.query;

  const data = await converter.convertFile({
    file: file as string,
    target: target as string,
  });

  return data;
});
