import { debounce } from "./callbacks";
import { device } from "../services/device.service";

const cache: Record<string, URLSearchParams> = {};

const getSearchParams = (search: string | undefined = "") => {
    cache[search] ??= new URLSearchParams(search);

    return cache[search];
};

export const setQueryStringWithoutPageReload = debounce((qsValue: string) => {
    const window = device.window;

    if (!window) return;

    const { protocol, host, pathname } = window.location;

    const newUrl = `${protocol}//${host}${pathname}?${qsValue}`;

    device.window?.history.pushState({ path: newUrl }, "//", newUrl);
});


export const setQueryStringValue = (
    key: string,
    value: string,
    queryString = device.window?.location.search
) => {
    const searchParams = getSearchParams(queryString);

    searchParams.set(key, value);

    setQueryStringWithoutPageReload(searchParams.toString());
};

export const getQueryStringValue = (
    key: string,
    queryString = device.window?.location.search
) => getSearchParams(queryString).get(key);
