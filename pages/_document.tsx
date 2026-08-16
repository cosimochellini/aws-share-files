// noinspection HtmlRequiredTitleElement

import {
  Html, Head, Main, NextScript,
} from 'next/document';

import { publicEnv } from '../src/instances/env.public';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta name="theme-color" content="#fff" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href={publicEnv.info.appLogoUrl} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
