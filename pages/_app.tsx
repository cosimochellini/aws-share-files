import Head from "next/head";
import theme from "../src/themes";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import Layout from "../src/components/Layout";

const AppGrid = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout Component={Component} pageProps={pageProps} />
      </ThemeProvider>
    </>
  );
};

export default AppGrid;
