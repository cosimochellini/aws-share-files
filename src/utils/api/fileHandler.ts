import type { Fields, Files } from 'formidable';
import { IncomingForm } from 'formidable';
import type { NextApiRequest } from 'next';

import { promises as fs } from 'fs';

type FormPromise = { fields: Fields; files: Files }

export async function fileHandler<T>(req: NextApiRequest) {
  const parser = new IncomingForm({ multiples: false });

  const form = await new Promise<FormPromise>((resolve, reject) => {
    parser.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ fields, files });
    });
  });

  return {
    form,
    body: form.fields as unknown as T,
    async getFile() {
      // Files are keyed by field name, typically 'file' field
      const fileFieldName = Object.keys(form.files)[0];

      if (!fileFieldName) {
        throw new Error('file is undefined');
      }

      const fileEntry = form.files[fileFieldName];

      // Handle both single file and array of files
      const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

      if (!file) {
        throw new Error('file is undefined');
      }

      if (!file.filepath) {
        throw new Error('file has no filepath');
      }

      return fs.readFile(file.filepath);
    },
  };
}
