import { Grid } from "@mui/material";
import { lazy, useState, Suspense } from "react";
import { S3Folder } from "../src/classes/S3Folder";
import { useDevice } from "../src/hooks/device.hook";
import { Files } from "../src/components/Files/Files";
import { S3FileGroup } from "../src/classes/S3FileGroup";
import { Folders } from "../src/components/Files/Folders";

const FileModalAsync = lazy(() => import("../src/components/Files/FileModal"));

export default function FilesPage() {
  const [selectedFolder, setSelectedFolder] = useState(null as S3Folder | null);

  const [selectedFileGroup, setSelectedFileGroup] = useState(
    null as S3FileGroup | null
  );

  const { isDesktop } = useDevice();

  return (
    <>
      <Grid container spacing={{ xs: 1, sm: 3 }} alignItems="flex-start">
        {isDesktop ? (
          <Grid item xs={12} sm={6} sx={{ minHeight: 800 }}>
            <Folders onSearch={setSelectedFolder} />
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6} sx={{ minHeight: { xs: 0, sm: 800 } }}>
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
