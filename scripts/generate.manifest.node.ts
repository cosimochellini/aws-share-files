// see next.config.js for why quiet is set
require('dotenv').config({ quiet: true });

const fs = require('fs').promises;

const { env } = require('../src/instances/env');
const overrideJson = require('../public/manifest.override.json');

export default async function run() {
  const manifest = { ...overrideJson, ...env.defaultManifest };

  await fs
    .writeFile('./public/manifest.json', JSON.stringify(manifest, null, 2))
    .then(() => console.log('manifest.json generated'))
    .catch(console.error);
}
