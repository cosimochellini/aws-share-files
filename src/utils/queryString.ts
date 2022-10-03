import { debounce } from './callbacks';
import { device } from '../services/device.service';
import { Nullable } from '../types/generic';

const cache: Record<string, URLSearchParams> = {
  '': new URLSearchParams(''),
};

const purgeString = (str: string) => str
  .replace(/[^=&]+=(&|$)/g, '')
  .replace(/&$/, '')
  .replace(/^&/, '');

const getSearchParams = (search: string | undefined = '') => {
  if (cache[search]) return cache[search];

  const currentQuery = new URLSearchParams(purgeString(search));

  cache[search] = currentQuery;

  return currentQuery;
};

export const setQueryStringWithoutPageReload = debounce((qsValue: string) => {
  const { window } = device;

  if (!window) return;

  const { protocol, host, pathname } = window.location;

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
) => getSearchParams(queryString).get(key);
