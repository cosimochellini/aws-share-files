import create from "zustand";
import type { Theme } from "../barrel/mui.barrel";
import { createTheme } from "../barrel/mui.barrel";
import { UnReactiveStore } from "../classes/UnReactiveStore";

export const theme = {
  get dark() {
    return createTheme({
      palette: {
        mode: "dark",
      },
    });
  },

  get light() {
    return createTheme({
      palette: {
        mode: "light",
      },
    });
  },
};

const storage = new UnReactiveStore("LS_DARK", true);

interface ThemeState {
  dark: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (dark: boolean) => void;
}

const initialDark = storage.value;

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: initialDark,
  theme: initialDark ? theme.dark : theme.light,

  setTheme: (theme: Theme) => {
    const dark = theme.palette.mode === "dark";

    set({ theme, dark });

    storage.set(dark);
  },

  toggleTheme: (dark: boolean) => {
    const { setTheme } = get();
    setTheme(dark ? theme.dark : theme.light);
  },

  checkTheme: () => {
    const { toggleTheme } = get();

    toggleTheme(storage.value);
  },
}));
