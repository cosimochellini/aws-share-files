import { Object, Owner } from "aws-sdk/clients/s3";
import { Nullable } from "../types/generic";

export abstract class S3BaseContent {
  public Object: Object;

  public Key: string;
  public Owner?: Owner;
  public Hierarchy: string[];
  public LastModified: Nullable<Date>;
  public Size: Nullable<number>;

  constructor(object: Object) {
    this.Object = object;
    this.Key = object.Key!;
    this.Owner = object.Owner;
    this.Hierarchy = this.Key?.split("/").filter((x) => x !== "") ?? [];
    this.LastModified = object.LastModified;
    this.Size = object.Size;
  }
}
