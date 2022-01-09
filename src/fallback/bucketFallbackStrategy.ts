type dependencyType = typeof import("../services/bucket.service");

export const bucketFallbackStrategy = async (
  actions: (dep: dependencyType) => Promise<unknown>
) => {
  try {
    const dependency = await import("../services/bucket.service");

    return await actions(dependency);
  } catch (e: any) {
    return {
      error: e.message,
    };
  }
};
