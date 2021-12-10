import Head from "next/head";
import "../styles/globals.css";
import theme from "../src/themes";
import { lazy, Suspense } from "react";
import type { AppProps } from "next/app";
import { env } from "../src/instances/env";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { useDevice } from "../src/hooks/device.hook";
import Layout from "../src/components/layouts/Layout";
import { NotificationHandler } from "../src/components/Global/NotificationHandler";

const ButtonNavigation = lazy(
  () => import("../src/components/layouts/ButtonNavigation")
);

const AppGrid = ({ Component, pageProps }: AppProps) => {
  const { isMobile } = useDevice();

  return (
    <>
      <Head>
        <title>{env.info.appTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout Component={Component} pageProps={pageProps} />
        {isMobile && (
          <Suspense fallback={null}>
            <ButtonNavigation />
          </Suspense>
        )}
        <NotificationHandler />
      </ThemeProvider>
    </>
  );
};

export default AppGrid;
