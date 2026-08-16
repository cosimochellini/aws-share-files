import { createTheme } from '@mui/material/styles';
import { beforeEach, describe, expect, it } from 'vitest';

import { theme, useThemeStore } from '../../src/store/theme.store';

const LS_KEY = 'LS_DARK';

const initialState = useThemeStore.getState();

const readPersisted = () => window.localStorage.getItem(LS_KEY);

describe('theme.store', () => {
  beforeEach(() => {
    useThemeStore.setState({ ...initialState, dark: true, theme: theme.dark }, true);
  });

  describe('memoised themes', () => {
    it('returns the very same dark theme object on repeated access', () => {
      expect(theme.dark).toBe(theme.dark);
      expect(theme.dark.palette.mode).toBe('dark');
    });

    it('returns the very same light theme object on repeated access', () => {
      expect(theme.light).toBe(theme.light);
      expect(theme.light.palette.mode).toBe('light');
    });

    it('keeps the two themes distinct', () => {
      expect(theme.dark).not.toBe(theme.light);
    });
  });

  describe('setTheme', () => {
    it('flags dark and persists true for a dark theme', () => {
      const darkTheme = createTheme({ palette: { mode: 'dark' } });

      useThemeStore.getState().setTheme(darkTheme);

      const state = useThemeStore.getState();

      expect(state.dark).toBe(true);
      expect(state.theme).toBe(darkTheme);
      expect(readPersisted()).toBe('true');
    });

    it('flags light and persists false for a light theme', () => {
      const lightTheme = createTheme({ palette: { mode: 'light' } });

      useThemeStore.getState().setTheme(lightTheme);

      const state = useThemeStore.getState();

      expect(state.dark).toBe(false);
      expect(state.theme).toBe(lightTheme);
      expect(readPersisted()).toBe('false');
    });
  });

  describe('toggleTheme', () => {
    it('goes from dark to light', () => {
      useThemeStore.setState({ dark: true, theme: theme.dark });

      useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().dark).toBe(false);
      expect(useThemeStore.getState().theme).toBe(theme.light);
      expect(readPersisted()).toBe('false');
    });

    it('goes from light back to dark', () => {
      useThemeStore.setState({ dark: false, theme: theme.light });

      useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().dark).toBe(true);
      expect(useThemeStore.getState().theme).toBe(theme.dark);
      expect(readPersisted()).toBe('true');
    });

    it('flips back and forth', () => {
      const { toggleTheme } = useThemeStore.getState();

      toggleTheme();
      expect(useThemeStore.getState().dark).toBe(false);

      toggleTheme();
      expect(useThemeStore.getState().dark).toBe(true);

      toggleTheme();
      expect(useThemeStore.getState().dark).toBe(false);
    });
  });

  describe('checkTheme', () => {
    it('applies the dark theme when true is persisted', () => {
      window.localStorage.setItem(LS_KEY, 'true');
      useThemeStore.setState({ dark: false, theme: theme.light });

      useThemeStore.getState().checkTheme();

      expect(useThemeStore.getState().dark).toBe(true);
      expect(useThemeStore.getState().theme).toBe(theme.dark);
    });

    it('applies the light theme when false is persisted', () => {
      window.localStorage.setItem(LS_KEY, 'false');

      useThemeStore.getState().checkTheme();

      expect(useThemeStore.getState().dark).toBe(false);
      expect(useThemeStore.getState().theme).toBe(theme.light);
    });

    it('falls back to the dark theme when nothing is persisted', () => {
      useThemeStore.setState({ dark: false, theme: theme.light });

      useThemeStore.getState().checkTheme();

      expect(useThemeStore.getState().dark).toBe(true);
      expect(useThemeStore.getState().theme).toBe(theme.dark);
    });
  });
});
