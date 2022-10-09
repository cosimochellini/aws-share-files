import { useState } from 'react';

import { getQueryStringValue, setQueryStringValue } from '../utils/queryString';

export function useQueryString(key: string, initialValue = '') {
  const [value, setValue] = useState<string | undefined>(
    getQueryStringValue(key) ?? initialValue,
  );

  const onSetValue = (newValue: string | undefined) => {
    setValue(newValue);
    setQueryStringValue(key, newValue);
  };

  return [value, onSetValue] as const;
}
