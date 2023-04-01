export class FileInfo {
  public Name: string;

  public Extension: string;

  public CompleteName: string;

  public Parent: string;

  constructor(fileName: string) {
    const [parent, fixedFileName] = fileName.split('/');

    if (!parent || !fixedFileName) throw new Error();

    this.Parent = parent;

    this.CompleteName = fixedFileName;

    [this.Name, this.Extension] = fixedFileName.split('.') as [string, string];
  }
}
