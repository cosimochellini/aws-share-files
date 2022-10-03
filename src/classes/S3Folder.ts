import { _Object } from '@aws-sdk/client-s3';
import { S3FileGroup } from './S3FileGroup';
import { S3BaseContent } from './S3BaseContent';

export class S3Folder extends S3BaseContent {
  public FolderName: string;

  public Files: S3FileGroup[];

  constructor(folder: _Object, siblings: _Object[]) {
    super(folder);

    this.FolderName = this.Key.split('/')[0];

    const files = siblings.filter(
      (s) => s.Key?.startsWith(this.Object.Key!) && s.Key !== this.Object.Key,
    );

    this.Size = files.reduce((acc, cur) => acc + (cur.Size ?? 0), 0);

    this.Files = S3FileGroup.Create(files);
  }
}
