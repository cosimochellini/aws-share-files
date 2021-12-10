export class FileInfo {
  public Name: string;
  public Extension: string;
  public CompleteName: string;

  constructor(fileName: string) {
    const fixedFileName = fileName.split("/").pop()!;

    this.CompleteName = fixedFileName;

    [this.Name, this.Extension] = fixedFileName.split(".");
  }
}
