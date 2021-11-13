export const caller = <T>(url: string) =>
  fetch("./api/" + url)
    .then((res) => res.json())
    .catch((err) => console.log(err))
    .then((res: T) => res);
