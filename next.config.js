// @ts-check

// quiet: dotenv 17 prints an "injected env" banner by default, which would show up on
// every next dev/build/start invocation and in every CI log line that shells out to them
require('dotenv')
  .config({ quiet: true });

const { withPWA } = require('./plugins/pwa.plugin');
const { withWebpack } = require('./plugins/webpack.plugin');
const { withRedirects } = require('./plugins/redirects.plugins');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  webpack: withWebpack,
  redirects: withRedirects,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
};

module.exports = withPWA(nextConfig);
