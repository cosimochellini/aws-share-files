import { env } from "../instances/env";
import { ServiceMapper } from "../types/generic";
import { notification } from "../instances/notification";
import { ContentResponse } from "../types/content.types";

const contentApiCaller = <T>(section: string, query = {}) => {
  const url = env.content.baseUrl + section;

  return fetch(url + "?" + new URLSearchParams(query).toString())
    .then((res) => res.json())
    .catch(notification.error) as Promise<T>;
};

export const content = {
  findFirstContent(query: string) {
    return contentApiCaller<ContentResponse>("/volumes", { q: query }).then(
      (res) => res.items[0].volumeInfo
    );
  },
};

export type contentTypes = ServiceMapper<typeof content>;
