import { device } from '../services/device.service';
import type { Nullable } from '../types/generic';

import { debounce } from './callbacks';

const cache = new Map<string, URLSearchParams>();

const purgeString = (str: string) => str
  .replace(/[^=&]+=(&|$)/g, '')
  .replace(/&$/, '')
  .replace(/^&/, '');

const getSearchParams = (search: string | undefined = '') => {
  if (cache.has(search)) return cache.get(search) as URLSearchParams;

  const currentQuery = new URLSearchParams(purgeString(search));

  cache.set(search, currentQuery);

  return currentQuery;
};

export const setQueryStringWithoutPageReload = debounce((qsValue: string) => {
  const { window } = device;

  if (!window) return;

  const {
    protocol,
    host,
    pathname,
  } = window.location;

  const path = `${protocol}//${host}${pathname}?${qsValue}`;

  window.history.pushState({ path }, '//', path);
});

export const setQueryStringValue = (
  key: string,
  value: Nullable<string>,
  queryString = device.window?.location.search,
) => {
  const searchParams = getSearchParams(queryString);

  searchParams.set(key, value ?? '');
  setQueryStringWithoutPageReload(searchParams.toString());
};

export const getQueryStringValue = (
  key: string,
  queryString = device.window?.location.search,
) => getSearchParams(queryString)
  .get(key);
