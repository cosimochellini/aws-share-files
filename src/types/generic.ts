/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiResponse } from 'next';

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type GenericFunction<T = unknown> = (this: any, ...args: any[]) => T;

export type ResponseType<T extends GenericFunction> = Awaited<ReturnType<T>>;

export type ServiceMapper<
  T extends Record<string, GenericFunction> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends GenericFunction
    ? ResponseType<T[key]>
    : T[key];
};

export type AwaitedServiceMapper<
  T extends Record<string, GenericFunction> | ServiceMapper<T>
> = {
  [key in keyof T]: T[key] extends GenericFunction
    ? Awaited<ResponseType<T[key]>>
    : /* @ts-ignore */
      AwaitedServiceMapper<T[key]>;
};

export type ServiceArguments<T extends Record<string, GenericFunction>> = {
  [key in keyof T]: T[key] extends GenericFunction
    ? Parameters<T[key]>[0]
    : never;
};

export type BaseResponse<T = unknown> = NextApiResponse<T | { error: string }>;

export type Nullable<T> = T | undefined;
