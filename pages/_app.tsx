import Head from "next/head";
import theme from "../src/themes";
import { lazy, Suspense } from "react";
import type { AppProps } from "next/app";
import { env } from "../src/instances/env";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import Layout from "../src/components/layouts/Layout";
import { useDevice } from "../src/hooks/device.hook";

const AppGrid = ({ Component, pageProps }: AppProps) => {
  const ButtonNavigation = lazy(
    () => import("../src/components/layouts/ButtonNavigation")
  );
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
        {isMobile ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ButtonNavigation />
          </Suspense>
        ) : null}
      </ThemeProvider>
    </>
  );
};

export default AppGrid;
