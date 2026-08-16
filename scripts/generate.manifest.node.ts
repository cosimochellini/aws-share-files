// ESM rather than require(): script.runner.node.ts loads this file with import(), and a
// module that exports with `export default` is detected as ESM, where require() does not
// exist. The dotenv import has to stay above the env import, because env.public.ts reads
// process.env while it is being evaluated. A side-effect import is what pins that order:
// `import dotenv from 'dotenv'; dotenv.config()` would be hoisted below both imports.
import 'dotenv/config';

import { readFile, writeFile } from 'node:fs/promises';

import { publicEnv } from '../src/instances/env.public.ts';

// resolved against this file rather than the process CWD, so the script writes the same
// place no matter where it is invoked from
const overridePath = new URL('../public/manifest.override.json', import.meta.url);
const manifestPath = new URL('../public/manifest.json', import.meta.url);

export default async function run() {
  const overrideJson = JSON.parse(await readFile(overridePath, 'utf8'));

  const manifest = { ...overrideJson, ...publicEnv.defaultManifest };

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('manifest.json generated');
}
