import { Grid } from "@mui/material";
import { Nullable } from "../src/types/generic";
import { lazy, useState, Suspense } from "react";
import { S3Folder } from "../src/classes/S3Folder";
import { useDevice } from "../src/hooks/device.hook";
import { Files } from "../src/components/Files/Files";
import { S3FileGroup } from "../src/classes/S3FileGroup";
import { Folders } from "../src/components/Files/Folders";

const FileModalAsync = lazy(() => import("../src/components/Files/FileModal"));

export default function FilesPage() {
  const [selectedFolder, setSelectedFolder] = useState<Nullable<S3Folder>>();

  const [selectedFileGroup, setSelectedFileGroup] =
    useState<Nullable<S3FileGroup>>();

  const { hasWidth } = useDevice();

  const sx = { minHeight: { xs: 0, sm: 800 } };
  const gridProps = { sx, md: 6, xs: 12, item: true };

  return (
    <>
      <Grid
        container
        spacing={{ xs: 0, sm: 3 }}
        alignItems="center"
        justifyItems={"center"}
      >
        {hasWidth(900) ? (
          <Grid {...gridProps}>
            <Folders onSearch={setSelectedFolder} />
          </Grid>
        ) : null}
        <Grid {...gridProps}>
          <Files
            onSearch={setSelectedFileGroup}
            currentFolder={selectedFolder}
            onClearFolder={() => setSelectedFolder(null)}
          />
        </Grid>
      </Grid>
      {selectedFileGroup && (
        <Suspense fallback={null}>
          <FileModalAsync file={selectedFileGroup} />
        </Suspense>
      )}
    </>
  );
}
