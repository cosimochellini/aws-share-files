import { useEffect, useState } from "react";
import { device } from "../services/device.service";

export const useDevice = () => {
  const [state, setState] = useState({
    isMobile: false,
    isDesktop: false,
    isClient: false,
    hasWidth: device.hasWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      const currentWindow = device.window;
      if (!currentWindow) return;

      setState({
        isMobile: device.isMobile,
        isDesktop: device.isDesktop,
        isClient: device.isClient,
        hasWidth: (w) => device.hasWidth(w),
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
};
