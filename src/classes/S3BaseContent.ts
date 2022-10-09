import type { _Object } from '@aws-sdk/client-s3';

import type { Nullable } from '../types/generic';

export abstract class S3BaseContent {
  public Object: _Object;

  public Key: string;

  public LastModified: Nullable<Date>;

  constructor(object: _Object) {
    this.Object = object;
    this.Key = object.Key ?? '';
    this.LastModified = object.LastModified;
  }
}
