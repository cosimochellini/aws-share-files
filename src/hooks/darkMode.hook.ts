import { useState } from 'react';

import { useDevice } from './device.hook';
import { useLocalStorage } from './localStorage.hook';

export const useDarkMode = () => {
  const device = useDevice();

  const [darkMode, setDarkMode] = useState(true);

  const [, setIsDarkMode] = useLocalStorage('DARK_MODE', device.isDarkMode);

  const publicSetDarkMode = (value: boolean) => {
    setDarkMode(value);
    setIsDarkMode(value);
  };
  return [darkMode, publicSetDarkMode] as const;
};
