import Head from "next/head";
import "../styles/globals.css";
import { lazy, Suspense } from "react";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";
import { env } from "../src/instances/env";
import { SessionProvider } from "next-auth/react";
import { useDevice } from "../src/hooks/device.hook";
import { useEffectOnceWhen } from "../src/hooks/once";
import Layout from "../src/components/layouts/Layout";
import { useThemeStore } from "../src/store/theme.store";
import { ThemeProvider, CssBaseline } from "../src/barrel/mui.barrel";
import NotificationHandler from "../src/components/Global/NotificationHandler";

const ButtonNavigation = lazy(
  () => import("../src/components/layouts/ButtonNavigation")
);

const AppGrid = (props: AppProps<{ session: Session }>) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const { isMobile } = useDevice();

  const [theme, checkTheme] = useThemeStore((x) => [x.theme, x.checkTheme]);

  useEffectOnceWhen(checkTheme);

  return (
    <>
      <Head>
        <title>{env.info.appTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <CssBaseline />
          <Layout Component={Component} pageProps={pageProps} />
          {isMobile && (
            <Suspense fallback={null}>
              <ButtonNavigation />
            </Suspense>
          )}
          <NotificationHandler />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

export default AppGrid;
