import type { _Object } from '@aws-sdk/client-s3';

import { FileInfo } from './FileInfo';
import { S3BaseContent } from './S3BaseContent';

export class S3File extends S3BaseContent {
  public FileInfo: FileInfo;

  public Parent: string;

  public FileSize : number;

  public FileName: string;

  constructor(file: _Object) {
    super(file);

    this.FileInfo = new FileInfo(this.Key);

    this.Parent = this.FileInfo.Parent;

    this.FileSize = file.Size ?? 0;

    this.FileName = this.FileInfo.Name;
  }
}
