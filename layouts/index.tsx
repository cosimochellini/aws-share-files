import { lazy, ReactElement, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { NextPageWithLayout } from '../src/types';
import { useDevice } from '../src/hooks/device.hook';
import { useEffectOnceWhen } from '../src/hooks/once';
import { useThemeStore } from '../src/store/theme.store';
import { Container } from '../src/components/layouts/Container';
import NotificationHandler from '../src/components/Global/NotificationHandler';

const ButtonNavigation = lazy(
  () => import('../src/components/layouts/ButtonNavigation'),
);

interface DefaultLayout {
  children: ReactElement;
}

export function Layout({ children }: DefaultLayout) {
  const { isMobile } = useDevice();

  const [theme, checkTheme] = useThemeStore((x) => [x.theme, x.checkTheme]);

  useEffectOnceWhen(checkTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container Component={children} />
      {isMobile && (
        <Suspense fallback={null}>
          <ButtonNavigation />
        </Suspense>
      )}
      <NotificationHandler />
    </ThemeProvider>
  );
}

export const withDefaultLayout = <T extends NextPageWithLayout>(Page: T) => {
  // eslint-disable-next-line no-param-reassign
  Page.getLayout = (children) => <Layout>{children}</Layout>;

  return Page;
};
