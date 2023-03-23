// @ts-check

require('dotenv')
  .config();

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
