import { Object, Owner } from "aws-sdk/clients/s3";

type FileInfo = [name: string, extension: string];

export class S3Content {
  Key?: string;

  LastModified?: Date;
  ETag?: string;
  Size?: number;
  StorageClass?: string;
  Owner?: Owner;

  IsFolder: boolean;

  FolderName?: string;
  Files: S3Content[];
  NestedSize?: number;

  Hierarchy: string[];
  FileName: string;
  FileInfo: FileInfo;

  Group: typeof S3Content.prototype.GroupedFiles;

  get GroupedFiles() {
    var map = new Map<string, S3Content[]>();

    for (const file of this.Files) {
      const [name = ""] = file.FileInfo ?? [];

      const groupFiles = map.get(name);

      if (groupFiles) {
        map.set(name, [...groupFiles, file]);
      } else {
        map.set(name, [file]);
      }
    }

    return Array.from(map.entries()).map(([fileName, files]) => ({
      fileName,
      files,
    }));
  }

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

    this.FolderName = this.Key?.substring(0, this.Key.length - 1) ?? "";
    this.Files = files
      .filter((f) => f.Key?.startsWith(this.Key!) && f.Key !== this.Key)
      .map((file) => new S3Content(file, files));

    this.BindNestedSize();

    this.FileInfo = this.FileName.split(".") as FileInfo;

    this.Group = this.GroupedFiles;
  }
}

export abstract class S3BaseContent {
  public Object: Object;

  public Key: string;
  public Owner?: Owner;
  public Hierarchy: string[];
  public LastModified: Date | undefined;

  constructor(object: Object) {
    this.Object = object;
    this.Key = object.Key!;
    this.Owner = object.Owner;
    this.Hierarchy = this.Key?.split("/").filter((x) => x !== "") ?? [];
    this.LastModified = object.LastModified;
  }
}
