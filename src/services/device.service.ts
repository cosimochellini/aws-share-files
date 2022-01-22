export const device = {
  get isClient() {
    return typeof window !== "undefined";
  },

  get isMobile() {
    return device.window?.matchMedia?.("(max-width: 767px)").matches ?? false;
  },

  get isDarkMode() {
    return (
      device.window?.matchMedia?.("(prefers-color-scheme: dark)").matches ??
      true
    );
  },

  get isDesktop() {
    return !device.isMobile;
  },

  get window() {
    if (device.isClient) return window;
    return null;
  },

  hasWidth(width: number) {
    return (device.window?.innerWidth ?? 0) >= width;
  },

  runOnClient(callback: () => void) {
    if (device.isClient) callback();
  },
};
