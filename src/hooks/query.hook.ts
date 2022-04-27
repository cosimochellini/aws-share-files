import { useState, useCallback, useEffect } from "react";
import { Nullable } from "../types/generic";
import { getQueryStringValue, setQueryStringValue } from "../utils/queryString";

export function useQueryString(key: string, initialValue: string = "") {
  const [value, setValue] = useState("" as Nullable<string>);

  useEffect(() => {
    setValue(() => getQueryStringValue(key) ?? initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetValue = useCallback(
    (newValue: Nullable<string>) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue] as const;
}
