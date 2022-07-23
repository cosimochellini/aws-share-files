import { useRef } from "react";

type Booleanish = boolean | string | number | null | undefined;

export const useOnce = (
  callback: () => void,
  condition: () => Booleanish = () => true
) => {
  const hasRun = useRef(false);

  if (!hasRun.current && condition()) {
    hasRun.current = true;
    callback();
  }
};
