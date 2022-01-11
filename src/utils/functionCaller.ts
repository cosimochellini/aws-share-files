import { Dictionary } from "../types/generic";

const defaultBehavior = <T>(promise: Promise<Response>) =>
  promise
    .then((res) =>
      res.ok
        ? (res.json() as Promise<T>)
        : res.json().then((error) => Promise.reject(error))
    )
    .then((res: T) => res);

const caller = <T>(url: string, query = {}) =>
  defaultBehavior<T>(
    fetch("/api/" + url + "?" + new URLSearchParams(query).toString())
  );

caller.post = <T>(url: string, body = {}) =>
  defaultBehavior<T>(
    fetch("/api/" + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );

caller.formData = <T>(url: string, form: Dictionary<unknown, string> = {}) => {
  const body = new FormData();

  for (const prop in form) {
    body.append(prop, form[prop] as string);
  }

  return defaultBehavior<T>(fetch("/api/" + url, { method: "POST", body }));
};

export { caller };
