import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import dotenv from 'dotenv';

// resolved against this file rather than the process CWD, so the runner behaves the same
// no matter where it is invoked from. Kept as a filesystem path rather than a URL: joining
// a bare filename onto a URL would let '#' or '?' in the name start a fragment or a query
// and silently truncate the path.
const scriptDirectory = fileURLToPath(new URL('./scripts/', import.meta.url));

// The runner owns .env loading rather than each script doing its own: this runs at module
// evaluation, and the scripts are pulled in by the dynamic import() inside run() below, so
// process.env is already populated by the time any of them is evaluated. That ordering
// matters -- src/instances/env.public.ts reads process.env while being evaluated.
dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)), quiet: true });

const run = async () => {
  // sorted so a run is reproducible: readdir order is filesystem-dependent, and these
  // scripts are reported (and, if one ever throws, blamed) by position in this list
  // .ts files only: every entry is import()ed and called, so a subdirectory or a stray
  // .DS_Store would abort the whole run -- and the run now fails the build
  const files: string[] = [];

  fs.readdirSync(scriptDirectory, { withFileTypes: true }).forEach((entry) => {
    if (entry.isFile() && entry.name.endsWith('.ts')) files.push(entry.name);
  });

  files.sort();

  console.log('files:', files);

  // CONTRACT: every script in ./scripts/ must be independent of the others. They are
  // loaded and run concurrently, so one that reads what another writes would race. If a
  // script ever needs to observe another's output, run them in sequence here instead of
  // adding it to this directory.
  const results = await Promise.all(files.map(async (file) => {
    // a file URL rather than a path: path.join('./scripts/', file) normalises the leading
    // './' away, and ESM reads a specifier that starts with neither './', '../' nor '/'
    // as a bare package name, so import() went looking for a package called 'scripts'.
    // pathToFileURL percent-encodes the whole path, so '#' and '?' in a filename stay part
    // of it, and it handles the Windows backslash case too.
    const modulePath = pathToFileURL(path.join(scriptDirectory, file)).href;
    const { default: script } = await import(modulePath);

    await script();

    return file;
  }));

  // logged after the fact so the output stays in `files` order rather than whichever
  // script happened to settle first
  results.forEach((file) => console.log(`Ran ${file}`));
};

run()
  .then(() => console.log('scripts ran successfully'))
  .catch((error) => {
    console.error(error);

    // yarn build is `yarn run-scripts && next build`, so without this the runner exits 0
    // and the build carries on as if every script had run
    process.exitCode = 1;
  });

export default run;
