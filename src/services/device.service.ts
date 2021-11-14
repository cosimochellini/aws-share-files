let isMobile: boolean | null = null;

export const device = {
  isMobile() {
    return (isMobile ??=
      this.window()?.matchMedia("(max-width: 767px)").matches ?? false);
  },
  window() {
    if (typeof window !== "undefined") return window;
    return null;
  },
};
