import { Nullable } from "../types/generic";
import { useState } from "react";
import { getQueryStringValue, setQueryStringValue } from "../utils/queryString";

export function useQueryString(key: string, initialValue: string = "") {
  const [value, setValue] = useState<Nullable<string>>(
    getQueryStringValue(key) ?? initialValue
  );

  const onSetValue = (newValue: Nullable<string>) => {
    setValue(newValue);
    setQueryStringValue(key, newValue);
  };

  return [value, onSetValue] as const;
}
