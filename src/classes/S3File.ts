import { Object } from "aws-sdk/clients/s3";
import { S3BaseContent } from "./S3Content";

type FileInfo = [fileName: string, extension: string];

export class S3File extends S3BaseContent {
  public FileInfo: FileInfo;

  constructor(file: Object) {
    super(file);

    const fileName = this.Hierarchy[this.Hierarchy.length - 1];

    this.FileInfo = fileName.split(".") as FileInfo;
  }
}
