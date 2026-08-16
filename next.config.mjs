// @ts-check

import dotenv from 'dotenv';
import withSerwistInit from '@serwist/next';

import { withRedirects } from './plugins/redirects.plugins.mjs';

// quiet: dotenv 17 prints an "injected env" banner by default, which would show up on
// every next dev/build/start invocation and in every CI log line that shells out to them
dotenv.config({ quiet: true });

// @serwist/next is ESM-only, which is why this file is .mjs rather than .js.
const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // `next dev` otherwise appends a block to CLAUDE.md on every run, which this repo
  // maintains by hand and which would leave the working tree permanently dirty
  agentRules: false,
  redirects: withRedirects,

  // The complete list of variables the browser is allowed to see, read by
  // src/instances/env.public.ts. Everything else in .env stays server-side: Next.js loads
  // the file itself before this config is evaluated, so pages/api/** and the build scripts
  // still get the full process.env at runtime.
  //
  // This replaces plugins/webpack.plugin.mjs, which added dotenv-webpack with
  // `systemvars: true` to every compilation and therefore inlined the S3 key, the SMTP
  // password and the converter API key into a public JS chunk. Add a name below only after
  // checking it is safe to publish.
  env: {
    APP_TITLE: process.env.APP_TITLE,
    APP_LOGO_URL: process.env.APP_LOGO_URL,
    APP_ICON_URL: process.env.APP_ICON_URL,
    CONTENT_INVALID_WORDS: process.env.CONTENT_INVALID_WORDS,
    // next-auth reads this one from client code too (next-auth/react resolves its base
    // path from it). It was inlined before, and dropping it would silently break any
    // deployment served from a sub-path.
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default withSerwist(nextConfig);
