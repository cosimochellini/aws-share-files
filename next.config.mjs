// @ts-check

import dotenv from 'dotenv';
import withSerwistInit from '@serwist/next';

import { withWebpack } from './plugins/webpack.plugin.mjs';
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
  webpack: withWebpack,
  redirects: withRedirects,
};

export default withSerwist(nextConfig);
