import { env } from "../instances/env";
import { ServiceMapper } from "../types/generic";

const contentApiCaller = <T>(section: string, query = {}) => {
  const url = env.content.baseUrl + section;

  return fetch(url + "?" + new URLSearchParams(query).toString())
    .then((res) => res.json())
    .catch(console.error) as Promise<T>;
};

export const content = {
  findFirstContent(query: string) {
    return contentApiCaller<any>("/volumes", { q: query });
  },
};

export type contentTypes = ServiceMapper<typeof content>;
