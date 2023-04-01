import type { _Object } from '@aws-sdk/client-s3';

import { S3File } from './S3File';
import { S3BaseContent } from './S3BaseContent';

export class S3Folder extends S3BaseContent {
  public FolderName: string;

  public Files: S3File[] = [];

  constructor(folder: _Object) {
    super(folder);

    [this.FolderName] = this.Key.split('/');
  }

  withFile(file: _Object) {
    this.Files.push(new S3File(file));

    return this;
  }

  public static Create(items: _Object[]) {
    const directoryMap = new Map<string, S3Folder>();

    for (const item of items) {
      // eslint-disable-next-line no-continue
      if (item.Key?.endsWith('/')) continue;

      const folderName = item.Key?.split('/')?.[0];

      // eslint-disable-next-line no-continue
      if (!folderName) continue;

      if (directoryMap.has(folderName)) {
        directoryMap.get(folderName)
          ?.withFile(item);
      } else {
        directoryMap.set(folderName, new S3Folder(item).withFile(item));
      }
    }

    return Array.from(directoryMap.values());
  }
}
