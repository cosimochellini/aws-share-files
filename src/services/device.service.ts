let isMobile: boolean | null = null;

export const device = {
  get isMobile() {
    return (isMobile ??=
      this.window?.matchMedia("(max-width: 767px)").matches ?? false);
  },
  get window() {
    if (typeof window !== "undefined") return window;
    return null;
  },
};
