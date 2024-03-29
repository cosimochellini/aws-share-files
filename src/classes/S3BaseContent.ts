import type { _Object } from '@aws-sdk/client-s3';

import type { Nullable } from '../types/generic';

export abstract class S3BaseContent {
  public Key: string;

  public LastModified: Nullable<Date>;

  protected constructor(object: _Object) {
    this.Key = object.Key ?? '';
    this.LastModified = object.LastModified;
  }
}
