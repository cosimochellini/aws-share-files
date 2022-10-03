import { retrieveError } from '../utils/retrieveError';

type dependencyType = typeof import('../services/bucket.service');

export const bucketFallbackStrategy = async (
  actions: (dep: dependencyType) => Promise<unknown>,
) => {
  try {
    const dependency = await import('../services/bucket.service');

    return await actions(dependency);
  } catch (e) {
    return {
      error: retrieveError(e),
    };
  }
};
