import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Dotenv from 'dotenv-webpack';

const pluginDirectory = path.dirname(fileURLToPath(import.meta.url));

export const withWebpack = (config) => {
  config.plugins = config.plugins || [];

  config.plugins = [
    ...config.plugins,

    // Read the .env file
    new Dotenv({
      path: path.join(pluginDirectory, '.env'),
      systemvars: true,
    }),
  ];

  return config;
};
