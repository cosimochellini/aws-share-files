export const retrieveError = (error: unknown) => {
  if (error instanceof Error) return error.message;

  if (typeof error === 'string') return error;

  if (typeof error === 'object') return JSON.stringify(error, null, 2);

  return 'Unknown error';
};
