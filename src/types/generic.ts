export type Dictionary<T> = { [key: string]: T };

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type ResponseType<T extends () => any> = Awaited<ReturnType<T>>;

export type ServiceMapper<T extends Dictionary<() => Promise<any>>> = {
  [key in keyof T]: ResponseType<T[key]>;
};
