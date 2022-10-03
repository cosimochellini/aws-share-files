import type { PackageJson } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
export const settings = require('../../package.json') as PackageJson;
