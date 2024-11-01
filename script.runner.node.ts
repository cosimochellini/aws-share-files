import fs from 'fs';
import path from 'path';

const scriptDirectory = './scripts/';

const run = async () => {
  const files = fs.readdirSync(scriptDirectory);

  console.log('files:', files);

  for (const file of files) {
    const modulePath = path.join(scriptDirectory, file);
    // eslint-disable-next-line no-await-in-loop
    const { default: script } = await import(modulePath);

    console.log(`Running ${file}`);

    // eslint-disable-next-line no-await-in-loop
    await script();
  }
};

run()
  .then(() => console.log('scripts ran successfully'))
  .catch(console.error);

export default run;
