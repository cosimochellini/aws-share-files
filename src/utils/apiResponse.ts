import { notification } from '../instances/notification';

/**
 * `fetch` only rejects on a transport failure, so an error status has to be raised here or
 * the error body would be parsed as though the call had succeeded.
 */
export const jsonOrThrow = (api: string, section: string) => (response: Response) => {
  if (!response.ok) throw new Error(`the ${api} API answered ${section} with ${response.status}`);

  return response.json();
};

/** Report the failure to the user, then let it carry on to the caller. */
export const reportAndRethrow = (error: unknown): never => {
  notification.error(error);

  throw error;
};
