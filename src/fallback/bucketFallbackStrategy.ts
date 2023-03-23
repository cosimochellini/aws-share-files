import { retrieveError } from '../utils/retrieveError';
import type { bucket } from '../services/bucket.service';

export const bucketFallbackStrategy = async (
  actions: (dep: typeof bucket) => Promise<unknown>,
) => {
  try {
    const dependency = await import('../services/bucket.service');

    return await actions(dependency.bucket);
  } catch (e) {
    return {
      error: retrieveError(e),
    };
  }
};
