import { Grid } from "@mui/material";
import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { S3Folder } from "../src/classes/S3Folder";
import { device } from "../src/services/device.service";
import { Folders } from "../src/components/Files/Folders";
import { functions, AwaitedFunctionTypes } from "../src/instances/functions";
import SwipeableEdgeDrawer from "../src/components/Files/SwipeableFiles";
import Files from "../src/components/Files/Files";

export default function Root() {
  const myContainer = useRef<Element>();

  const [loading, setLoading] = useState(true);

  const [folders, setFolders] = useState(
    [] as AwaitedFunctionTypes["s3"]["root"]
  );

  const [selectedFolder, setSelectedFolder] = useState(null as S3Folder | null);

  useEffect(() => {
    functions.s3
      .root()
      .then((res) => setFolders(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Grid container spacing={{ xs: 1, sm: 3 }} alignItems="flex-start">
        {device.isDesktop ? (
          <Grid item xs={12} sm={6} sx={{ minHeight: 800 }}>
            <Folders
              folders={folders}
              loading={loading}
              onSearch={setSelectedFolder}
            />
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6} sx={{ minHeight: { xs: 0, sm: 800 } }}>
          <Files
            folders={folders}
            loading={loading}
            onSearch={(s) => console.log(s)}
            currentFolder={selectedFolder}
            onClearFolder={() => setSelectedFolder(null)}
          />
        </Grid>
      </Grid>
    </>
  );
}
