import { notification } from "../instances/notification";

const caller = <T>(url: string, query = {}) =>
  fetch("/api/" + url + "?" + new URLSearchParams(query).toString())
    .then((res) => res.json())
    .catch(notification.error)
    .then((res: T) => res);

caller.post = <T>(url: string, body = {}) =>
  fetch("/api/" + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch(notification.error)
    .then((res: T) => res);

export { caller };
