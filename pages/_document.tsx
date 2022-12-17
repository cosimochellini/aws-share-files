// noinspection HtmlRequiredTitleElement

import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

import { env } from '../src/instances/env';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
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
  }
}

export default MyDocument;
