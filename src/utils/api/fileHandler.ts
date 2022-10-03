import { promises as fs } from 'fs';

import { NextApiRequest } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';

type FormPromise = { fields: Fields; files: Files };

export async function fileHandler<T>(req: NextApiRequest) {
  const form = await new Promise<FormPromise>((resolve, reject) => {
    new IncomingForm().parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ fields, files });
    });
  });

  return {
    form,
    body: form.fields as unknown as T,
    async getFile() {
      const { file } = form.files;

      if (Array.isArray(file)) throw new Error('file is an array');

      const buffer = await fs.readFile(file.filepath as string);

      return buffer;
    },
  };
}
