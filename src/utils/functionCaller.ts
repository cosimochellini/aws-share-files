const defaultBehavior = <T>(promise: Promise<Response>) => promise.then((res) => (res.ok ? (res.json() as Promise<T>) : res.json().then((error) => Promise.reject(error))));

const caller = <T>(url: string, query = {}) => defaultBehavior<T>(fetch(`/api/${url}?${new URLSearchParams(query).toString()}`));

caller.post = <T>(url: string, body = {}) => defaultBehavior<T>(
  fetch(`/api/${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
);

caller.formData = <T>(url: string, form: Record<string, unknown> = {}) => {
  const body = Object.keys(form).reduce((data, key) => {
    const value = form[key];

    if (value instanceof File) {
      // For File objects, append them directly
      data.append(key, value);
    } else {
      // For other types, convert to string
      data.append(key, value as string);
    }

    return data;
  }, new FormData());

  return defaultBehavior<T>(fetch(`/api/${url}`, { method: 'POST', body }));
};

export { caller };
