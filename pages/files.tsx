import { Grid } from "../src/barrel/mui.barrel";
import { Nullable } from "../src/types/generic";
import { lazy, useState, Suspense } from "react";
import { S3Folder } from "../src/classes/S3Folder";
import { useDevice } from "../src/hooks/device.hook";
import { Files } from "../src/components/Files/Files";
import { useQueryString } from "../src/hooks/query.hook";
import { S3FileGroup } from "../src/classes/S3FileGroup";

const FolderAsync = lazy(() => import("../src/components/Files/Folders"));
const FileModalAsync = lazy(() => import("../src/components/Files/FileModal"));

export default function FilesPage() {
  const [fileKey, setFileKey] = useQueryString("fileKey");
  const [folderKey, setFolderKey] = useQueryString("folderKey");

  const [selectedFolder, setSelectedFolder] = useState<Nullable<S3Folder>>();

  const [selectedFileGroup, setSelectedFileGroup] =
    useState<Nullable<S3FileGroup>>();

  const onClose = () => {
    setFileKey("");
    setSelectedFileGroup(null);
  };

  const { hasWidth } = useDevice();

  const sx = { minHeight: { xs: 0, sm: 800 } };
  const gridProps = { sx, md: 6, xs: 12, item: true };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyItems={"center"}
        spacing={{ xs: 0, sm: 3 }}
      >
        {hasWidth(900) && (
          <Grid {...gridProps}>
            <Suspense fallback={null}>
              <FolderAsync
                folderKey={folderKey}
                setFolderKey={setFolderKey}
                onSearch={setSelectedFolder}
              />
            </Suspense>
          </Grid>
        )}
        <Grid {...gridProps}>
          <Files
            fileKey={fileKey}
            setFileKey={setFileKey}
            fileGroup={selectedFileGroup}
            onSearch={setSelectedFileGroup}
            currentFolder={selectedFolder}
            onClearFolder={() => {
              setFolderKey("");
              setSelectedFolder(null);
            }}
          />
        </Grid>
      </Grid>
      {selectedFileGroup && (
        <Suspense fallback={null}>
          <FileModalAsync file={selectedFileGroup} onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}
