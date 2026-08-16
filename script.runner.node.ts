import fs from 'fs';
import path from 'path';

const scriptDirectory = './scripts/';

const run = async () => {
  const files = fs.readdirSync(scriptDirectory);

  console.log('files:', files);

  // The scripts are independent build steps, so they load and run together
  // rather than serialising one round-trip per file.
  await Promise.all(files.map(async (file) => {
    const modulePath = path.join(scriptDirectory, file);
    const { default: script } = await import(modulePath);

    console.log(`Running ${file}`);

    return script();
  }));
};

run()
  .then(() => console.log('scripts ran successfully'))
  .catch(console.error);

export default run;
