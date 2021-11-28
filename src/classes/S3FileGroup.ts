import { S3File } from "./S3File";
import { Object } from "aws-sdk/clients/s3";
import { S3BaseContent } from "./S3Content";

export class S3FileGroup extends S3BaseContent {
  public FileName: string;

  public Files: { extension: string; file: S3File }[];

  constructor(file: Object, siblings: Object[]) {
    super(file);

    this.FileName = this.Hierarchy[this.Hierarchy.length - 1];

    this.Files = siblings.map((sibling) => {
      const file = new S3File(sibling);
      const [, extension] = file.FileInfo;

      return { extension, file };
    });
  }

  /**
   * group files by their file + extension
   * @param files
   * @param siblings
   */
  public static Create(
    fileInCurrentFolder: Object[],
    siblings: Object[]
  ): S3FileGroup[] {
    const files = fileInCurrentFolder.map((file) => new S3File(file, siblings));

    const map = [] as { fileName: string; files: S3File[] }[];

    for (const file of files) {
      const fileName = file.FileInfo[0];

      if (map.findIndex((f) => f.fileName === fileName) === -1) {
        map.push({ fileName, files: [] });
      }

      map.find((f) => f.fileName === fileName)!.files.push(file);
    }

    return map.map((f) => new S3FileGroup(f.files[0].Object, f.files));
  }
}
