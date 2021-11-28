import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { S3Folder } from "../src/classes/S3Folder";
import { Files } from "../src/components/Files/Files";
import { Folders } from "../src/components/Files/Folders";
import { functions, AwaitedFunctionTypes } from "../src/instances/functions";

export default function Root() {
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
      <Grid container spacing={3} columnSpacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} sm={6}>
          <Folders
            folders={folders}
            loading={loading}
            onSearch={setSelectedFolder}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Files
            folders={folders}
            loading={loading}
            onSearch={(s) => console.log(s)}
            currentFolder={selectedFolder}
          ></Files>
        </Grid>
      </Grid>
    </>
  );
}
