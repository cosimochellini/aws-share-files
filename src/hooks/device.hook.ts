import { useState } from "react";
import { useEffectOnce } from ".";
import { debounce } from "../utils/callbacks";
import { device } from "../services/device.service";

const initialDeviceState = {
  isClient: false,
  isMobile: false,
  isDarkMode: false,
  isDesktop: false,
  window: null,
  runOnClient: () => {},
  hasWidth: () => false,
} as typeof device;

export const useDevice = () => {
  const [state, setState] = useState(initialDeviceState);

  useEffectOnce(() => {
    const handleResize = debounce((_: unknown) => {
      setState({ ...device, hasWidth: (x) => device.hasWidth(x) });
    });

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  return state;
};
