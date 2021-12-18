import { useEffect, useState } from "react";
import { useDevice } from "./device.hook";
import { useLocalStorage } from "../hooks/localStorage.hook";

export const useDarkMode = () => {
  const device = useDevice();

  const [darkMode, setDarkMode] = useState(true);

  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    "DARK_MODE",
    device.isDarkMode
  );

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  return [darkMode, setIsDarkMode] as const;
};
