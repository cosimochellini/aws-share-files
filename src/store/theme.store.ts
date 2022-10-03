import create from 'zustand';
import type { Theme } from '../barrel/mui.barrel';
import { createTheme } from '../barrel/mui.barrel';
import { UnReactiveStore } from '../classes/UnReactiveStore';

export const theme = {
  __dark: null as Theme | null,
  get dark() {
    // eslint-disable-next-line no-return-assign, no-underscore-dangle
    return (this.__dark ??= createTheme({
      palette: {
        mode: 'dark',
      },
    }));
  },

  _light: null as Theme | null,
  get light() {
    // eslint-disable-next-line no-return-assign, no-underscore-dangle
    return (this._light ??= createTheme({
      palette: {
        mode: 'light',
      },
    }));
  },
};

const storage = new UnReactiveStore('LS_DARK', true);

interface ThemeState {
  dark: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  checkTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: storage.value,
  theme: theme.dark,

  setTheme(theme) {
    const dark = theme.palette.mode === 'dark';

    set({ theme, dark });

    storage.set(dark);
  },

  toggleTheme() {
    const { setTheme, dark } = get();
    setTheme(dark ? theme.light : theme.dark);
  },

  checkTheme() {
    const { setTheme } = get();
    setTheme(storage.value ? theme.dark : theme.light);
  },
}));
