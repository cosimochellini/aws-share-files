import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { env } from "../src/instances/env";
import GlobalThemes from "../src/themes/index";
import { SessionProvider } from "next-auth/react";
import { useDevice } from "../src/hooks/device.hook";
import Layout from "../src/components/layouts/Layout";
import { useDarkMode } from "../src/hooks/darkMode.hook";
import { lazy, Suspense, useEffect, useState } from "react";
import { Context, defaultContext } from "../src/hooks/context.hook";
import { ThemeProvider, CssBaseline } from "../src/barrel/mui.barrel";
import { NotificationHandler } from "../src/components/Global/NotificationHandler";

const ButtonNavigation = lazy(
  () => import("../src/components/layouts/ButtonNavigation")
);

const AppGrid = (props: AppProps) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const { isMobile } = useDevice();
  const [isDarkMode] = useDarkMode();

  const [jobs, setJobs] = useState(defaultContext.jobs);
  const [theme, setTheme] = useState(defaultContext.theme);

  const providedData = {
    jobs,
    theme,

    setJobs,
    setTheme,
  };

  useEffect(() => {
    setTheme(isDarkMode ? GlobalThemes.dark : GlobalThemes.light);
  }, [isDarkMode]);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>{env.info.appTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Context.Provider value={providedData}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout Component={Component} pageProps={pageProps} />
          {isMobile && (
            <Suspense fallback={null}>
              <ButtonNavigation />
            </Suspense>
          )}
          <NotificationHandler />
        </ThemeProvider>
      </Context.Provider>
    </SessionProvider>
  );
};

export default AppGrid;
