import { notification } from "../instances/notification";

export const caller = <T>(url: string, query = {}) =>
  fetch("./api/" + url + "?" + new URLSearchParams(query).toString())
    .then((res) => res.json())
    .catch(notification.error)
    .then((res: T) => res);
