// noinspection HtmlRequiredTitleElement

import {
  Html, Head, Main, NextScript,
} from 'next/document';

import { env } from '../src/instances/env';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta name="theme-color" content="#fff" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href={env.info.appLogoUrl} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
