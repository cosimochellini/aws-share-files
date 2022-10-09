export class FileInfo {
  public Name: string;

  public Extension: string;

  public CompleteName: string;

  public Parent: string;

  constructor(fileName: string) {
    const [parent, fixedFileName] = fileName.split('/');

    this.Parent = parent;

    this.CompleteName = fixedFileName;

    [this.Name, this.Extension] = fixedFileName.split('.');
  }
}
