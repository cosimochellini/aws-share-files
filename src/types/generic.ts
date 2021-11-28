export type FileInfo = [fileName: string, extension: string];

export type Dictionary<T> = { [key: string]: T };

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type ResponseType<T extends () => unknown> = Awaited<ReturnType<T>>;

export type ServiceMapper<
  T extends Dictionary<() => Promise<unknown>> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends () => Promise<unknown>
    ? ResponseType<T[key]>
    : T[key];
};

export type AwaitedServiceMapper<
  T extends Dictionary<() => Promise<unknown>> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends () => Promise<unknown>
    ? Awaited<ResponseType<T[key]>>
    : /* @ts-ignore */
      AwaitedServiceMapper<T[key]>;
};
