const fs = require("fs");
const scriptDirectory = "./scripts/";

const run = async () => {
  const files = fs.readdirSync(scriptDirectory);

  console.log("files:", files);

  for await (const file of files) {
    const script = require(`${scriptDirectory}${file}`).default;

    console.log(`Running ${file}`);

    await script();
  }
};

run()
  .then(() => console.log("scripts ran successfully"))
  .catch(console.error);

export default run;
