import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { env } from "../src/instances/env";
import {  useEffectOnce } from "../src/hooks";
import { lazy, Suspense, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useDevice } from "../src/hooks/device.hook";
import Layout from "../src/components/layouts/Layout";
import { theme, useThemeStore } from "../src/store/theme.store";
import { ThemeProvider, CssBaseline } from "../src/barrel/mui.barrel";
import NotificationHandler from "../src/components/Global/NotificationHandler";

const ButtonNavigation = lazy(
  () => import("../src/components/layouts/ButtonNavigation")
);

const AppGrid = (props: AppProps) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const { isMobile } = useDevice();

  const themeStore = useThemeStore((x) => x);

  const [currentTheme, setCurrentTheme] = useState(theme.dark);

  useEffectOnce(() => setCurrentTheme(themeStore.theme));

  return (
    <>
      <Head>
        <title>{env.info.appTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={currentTheme}>
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
