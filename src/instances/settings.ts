import type { PackageJson } from 'type-fest';

import packageJson from '../../package.json';

export const settings = packageJson as PackageJson;
