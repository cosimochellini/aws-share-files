// @ts-check

require('dotenv').config();

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
  optimization: {
    mergeDuplicateChunks: true,
  },
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            browsers: '>1%, not ie 11, not op_mini all',
          },
        },
      },
    ],
  ],
};

module.exports = withPWA(nextConfig);
