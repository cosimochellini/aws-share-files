import { Object } from "aws-sdk/clients/s3";
import { S3BaseContent } from "./S3Content";
import { S3FileGroup } from "./S3FileGroup";

export class S3Folder extends S3BaseContent {
  public FolderName: string;
  public Files: S3FileGroup[];

  constructor(folder: Object, siblings: Object[]) {
    super(folder);

    [this.FolderName] = this.Key.split("/");

    const files = siblings.filter(
      (s) => s.Key?.startsWith(this.Object.Key!) && s.Key !== this.Object.Key
    );

    this.Files = S3FileGroup.Create(files, siblings);
  }
}
