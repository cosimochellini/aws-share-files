import { converter } from '../../../src/services/converter.service';
import { defaultBehavior } from '../../../src/utils/api/composable';

export default defaultBehavior(async (req) => {
  const { id } = req.query;

  const data = await converter.getConversionStatus(id as string);

  return data;
});
