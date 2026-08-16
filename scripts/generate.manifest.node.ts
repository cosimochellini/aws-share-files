// ESM rather than require(): script.runner.node.ts loads this file with import(), and a
// module that exports with `export default` is detected as ESM, where require() does not
// exist. .env is already loaded by script.runner.node.ts, which imports this file only
// after doing so -- which is what lets env.public.ts read process.env at import time here.
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
