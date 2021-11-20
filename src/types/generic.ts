export type Dictionary<T> = { [key: string]: T };

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type ResponseType<T extends () => any> = Awaited<ReturnType<T>>;

export type ServiceMapper<
  T extends Dictionary<() => Promise<any>> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends () => Promise<any>
    ? ResponseType<T[key]>
    : T[key];
};

export type AwaitedServiceMapper<
  T extends Dictionary<() => Promise<any>> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends () => Promise<any>
    ? Awaited<ResponseType<T[key]>>
    : AwaitedServiceMapper<T[key]>;
};
