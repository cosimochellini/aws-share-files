import { env } from "../src/instances/env";
import { Context } from "../src/hooks/context.hook";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={this.context.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta name="theme-color" content="#fff" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href={env.info.appLogoUrl}></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.contextType = Context;

export default MyDocument;
