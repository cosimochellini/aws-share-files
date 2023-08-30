import type { NextApiRequest } from 'next';
import type { Fields, Files } from 'formidable';
import { IncomingForm } from 'formidable';

import { promises as fs } from 'fs';

type FormPromise = { fields: Fields; files: Files };

export async function fileHandler<T>(req: NextApiRequest) {
  const form = await new Promise<FormPromise>((resolve, reject) => {
    new IncomingForm().parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({
        fields,
        files,
      });
    });
  });

  return {
    form,
    body: form.fields as unknown as T,
    async getFile() {
      const file = form.files[0]?.[0];

      if (!file) throw new Error('file is undefined');

      if (Array.isArray(file)) throw new Error('file is an array');

      return fs.readFile(file?.filepath as string);
    },
  };
}
