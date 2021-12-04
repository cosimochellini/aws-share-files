let isMobile: boolean | null = null;

export const device = {
  get isMobile() {
    return (isMobile ??=
      this.window?.matchMedia("(max-width: 767px)").matches ?? false);
  },

  hasWidth(width: number) {
    return (this.window?.innerWidth ?? 0) >= width;
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
