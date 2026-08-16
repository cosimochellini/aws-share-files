import { env } from '../instances/env';
import type { ServiceArguments, ServiceMapper } from '../types/generic';
import type { ContentResponse } from '../types/content.types';
import { jsonOrThrow, reportAndRethrow } from '../utils/apiResponse';

const contentApiCaller = <T>(section: string, query = {}) => {
  const url = env.content.baseUrl + section;

  return fetch(`${url}?${new URLSearchParams(query).toString()}`)
    .then(jsonOrThrow('content', section))
    .catch(reportAndRethrow) as Promise<T>;
};

export const content = {
  findFirstContent(query: string) {
    return contentApiCaller<ContentResponse>('/volumes', { q: query }).then(
      (res) => res.items?.[0]?.volumeInfo,
    );
  },
  findAllContent(query: string) {
    return contentApiCaller<ContentResponse>('/volumes', { q: query }).then(
      (res) => res.items?.map((x) => x.volumeInfo) ?? [],
    );
  },
};

export type contentTypes = ServiceMapper<typeof content>;

export type contentArgs = ServiceArguments<typeof content>;
