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

  public static Create(items: _Object[]) {
    const directoryMap = new Map<string, S3Folder>();

    for (const item of items) {
      if (item.Key?.endsWith('/')) continue;

      const folderName = item.Key?.split('/')?.[0];

      if (!folderName) continue;

      const folder = (directoryMap.has(folderName)
        ? directoryMap.get(folderName) : new S3Folder(item)) as S3Folder;

      folder.Files.push(new S3File(item));
    }

    return Object.values(directoryMap);
  }
}
