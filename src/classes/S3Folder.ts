import { _Object } from '@aws-sdk/client-s3';

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
    const directoryMap = new Map<string | undefined, S3Folder>();

    for (const item of items) {
      if (item.Key?.endsWith('/')) continue;

      const folderName = item.Key?.split('/')?.[0];

      if (!directoryMap.has(folderName)) {
        directoryMap.set(folderName, new S3Folder(item));
      }

      const folder = directoryMap.get(folderName);

      if (!folder) continue;

      folder.Files.push(new S3File(item));
    }

    return [...directoryMap.values()];
  }
}
