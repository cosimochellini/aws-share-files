import { byString, byValue } from 'sort-es';
import type { _Object } from '@aws-sdk/client-s3';

import { S3File } from './S3File';
import { FileInfo } from './FileInfo';
import { S3BaseContent } from './S3BaseContent';

export class S3FileGroup extends S3BaseContent {
  public FileName: string;

  public FileInfo: FileInfo;

  public Files: { extension: string; file: S3File }[];

  constructor(file: _Object, siblings: _Object[]) {
    super(file);

    this.FileName = this.Hierarchy[this.Hierarchy.length - 1];
    this.FileInfo = new FileInfo(this.FileName);

    this.Files = siblings.map((sibling) => {
      const file = new S3File(sibling);
      const { Extension } = file.FileInfo;

      return { extension: Extension, file };
    });
  }

  /**
   * group files by their file + extension
   * @param files
   */
  public static Create(filesInCurrentFolder: _Object[]): S3FileGroup[] {
    const files = filesInCurrentFolder.map((file) => new S3File(file));

    const map = files.reduce((cache, file) => {
      const { Name } = file.FileInfo;

      if (cache.findIndex((f) => f.fileName === Name) === -1) {
        cache.push({ fileName: Name, files: [] });
      }

      cache.find((f) => f.fileName === Name)?.files.push(file);

      return cache;
    }, [] as { fileName: string; files: S3File[] }[]);

    return map
      .map(
        (f) => new S3FileGroup(
          f.files[0].Object,
          f.files.map((x) => x.Object),
        ),
      )
      .sort(byValue((x) => x.FileName, byString()));
  }
}
