export const caller = <T>(url: string, query = {}) =>
  fetch("./api/" + url + "?" + new URLSearchParams(query).toString())
    .then((res) => res.json())
    .catch(console.error)
    .then((res: T) => res);
