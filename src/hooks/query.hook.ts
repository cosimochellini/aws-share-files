import { useState } from 'react';
import { Nullable } from '../types/generic';
import { getQueryStringValue, setQueryStringValue } from '../utils/queryString';

export function useQueryString(key: string, initialValue = '') {
  const [value, setValue] = useState<Nullable<string>>(
    getQueryStringValue(key) ?? initialValue,
  );

  const onSetValue = (newValue: Nullable<string>) => {
    setValue(newValue);
    setQueryStringValue(key, newValue);
  };

  return [value, onSetValue] as const;
}
