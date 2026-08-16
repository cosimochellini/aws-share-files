import fs from 'fs';
import path from 'path';

const scriptDirectory = './scripts/';

const run = async () => {
  // sorted so a run is reproducible: readdir order is filesystem-dependent, and these
  // scripts are reported (and, if one ever throws, blamed) by position in this list
  const files = fs.readdirSync(scriptDirectory).sort();

  console.log('files:', files);

  // CONTRACT: every script in ./scripts/ must be independent of the others. They are
  // loaded and run concurrently, so one that reads what another writes would race. If a
  // script ever needs to observe another's output, run them in sequence here instead of
  // adding it to this directory.
  const results = await Promise.all(files.map(async (file) => {
    const modulePath = path.join(scriptDirectory, file);
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
  .catch(console.error);

export default run;
