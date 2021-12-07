import { Object, Owner } from "aws-sdk/clients/s3";

export abstract class S3BaseContent {
  public Object: Object;

  public Key: string;
  public Owner?: Owner;
  public Hierarchy: string[];
  public LastModified: Date | undefined;
  public Size: number | undefined;

  constructor(object: Object) {
    this.Object = object;
    this.Key = object.Key!;
    this.Owner = object.Owner;
    this.Hierarchy = this.Key?.split("/").filter((x) => x !== "") ?? [];
    this.LastModified = object.LastModified;
    this.Size = object.Size;
  }
}
