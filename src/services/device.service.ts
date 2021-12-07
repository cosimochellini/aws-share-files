export const device = {
  get isMobile() {
    return this.window?.matchMedia("(max-width: 767px)").matches ?? false;
  },

  hasWidth(width: number) {
    return (device.window?.innerWidth ?? 0) >= width;
  },

  get isDesktop() {
    return !this.isMobile;
  },

  get window() {
    if (typeof window !== "undefined") return window;
    return null;
  },

  get isClient() {
    return typeof window !== "undefined";
  },
};
