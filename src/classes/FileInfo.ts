export class FileInfo {
  public Name: string;
  public Extension: string;

  constructor(fileName: string) {
    [this.Name, this.Extension] = fileName.split(".");
  }
}
