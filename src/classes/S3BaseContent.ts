import type { Nullable } from "../types/generic";
import type { Owner, _Object } from "@aws-sdk/client-s3";

export abstract class S3BaseContent {
  public Object: _Object;

  public Key: string;
  public Owner?: Owner;
  public Hierarchy: string[];
  public LastModified: Nullable<Date>;
  public Size: Nullable<number>;

  constructor(object: _Object) {
    this.Object = object;
    this.Key = object.Key!;
    this.Owner = object.Owner;
    this.Hierarchy = this.Key?.split("/").filter((x) => x !== "") ?? [];
    this.LastModified = object.LastModified;
    this.Size = object.Size;
  }
}
