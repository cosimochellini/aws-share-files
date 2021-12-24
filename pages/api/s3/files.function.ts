import { bucket } from "../../../src/services/bucket.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior((req) => bucket.getAllFiles());
