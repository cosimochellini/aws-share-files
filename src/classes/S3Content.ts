import { Object, Owner } from "aws-sdk/clients/s3";

export class S3Content {
  Key?: string;

  LastModified?: Date;
  ETag?: string;
  Size?: number;
  StorageClass?: string;
  Owner?: Owner;

  IsFolder: boolean;

  FolderName?: string;
  Files?: Object[];
  NestedSize?: number;

  Hierarchy: string[];
  FileName: string;

  BindNestedSize() {
    this.NestedSize =
      this.Files?.reduce((acc, file) => acc + (file.Size ?? 0), 0) ?? 0;
  }

  constructor(content: Object, files: Object[]) {
    this.Key = content.Key;
    this.LastModified = content.LastModified;
    this.ETag = content.ETag;
    this.Size = content.Size;
    this.StorageClass = content.StorageClass;
    this.Owner = content.Owner;

    this.IsFolder = this.Key?.endsWith("/") ?? false;

    this.Hierarchy = this.Key?.split("/").filter((x) => x !== "") ?? [];
    this.FileName = this.Hierarchy[this.Hierarchy.length - 1] ?? "";

    if (this.IsFolder) {
      this.FolderName = this.Key?.substring(0, this.Key.length - 1) ?? "";
      this.Files = files.filter(
        (file) => file.Key?.startsWith(this.Key!) && file.Key !== this.Key
      );

      this.BindNestedSize();
    }
  }
}
