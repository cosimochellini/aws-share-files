import type { _Object } from '@aws-sdk/client-s3';

import { FileInfo } from './FileInfo';
import { S3BaseContent } from './S3BaseContent';

export class S3File extends S3BaseContent {
  public FileInfo: FileInfo;

  constructor(file: _Object) {
    super(file);

    this.FileInfo = new FileInfo(this.Key);
  }
}
