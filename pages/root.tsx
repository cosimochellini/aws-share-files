import { Grid } from "@mui/material";
import { S3Folder } from "../src/classes/S3Folder";
import { useDevice } from "../src/hooks/device.hook";
import { Files } from "../src/components/Files/Files";
import { S3FileGroup } from "../src/classes/S3FileGroup";
import { Folders } from "../src/components/Files/Folders";
import { lazy, useEffect, useState, Suspense } from "react";
import { notification } from "../src/instances/notification";
import { useSession, signIn, signOut } from "next-auth/react";
import { functions, AwaitedFunctionTypes } from "../src/instances/functions";

const FileModalAsync = lazy(() => import("../src/components/Files/FileModal"));

export default function Root() {
  const { data: session } = useSession();

  //   const [loading, setLoading] = useState(true);

  //   const [folders, setFolders] = useState(
  //     [] as AwaitedFunctionTypes["s3"]["root"]
  //   );

  //   const [selectedFolder, setSelectedFolder] = useState(null as S3Folder | null);

  //   const [selectedFileGroup, setSelectedFileGroup] = useState(
  //     null as S3FileGroup | null
  //   );

  //   const { isDesktop } = useDevice();

  //   useEffect(() => {
  //     functions.s3
  //       .root()
  //       .then((res) => setFolders(res))
  //       .catch(notification.error)
  //       .finally(() => setLoading(false));
  //   }, []);

  //   return (
  //     <>
  //       <Grid container spacing={{ xs: 1, sm: 3 }} alignItems="flex-start">
  //         {isDesktop ? (
  //           <Grid item xs={12} sm={6} sx={{ minHeight: 800 }}>
  //             <Folders
  //               folders={folders}
  //               loading={loading}
  //               onSearch={setSelectedFolder}
  //             />
  //           </Grid>
  //         ) : null}
  //         <Grid item xs={12} sm={6} sx={{ minHeight: { xs: 0, sm: 800 } }}>
  //           <Files
  //             folders={folders}
  //             loading={loading}
  //             onSearch={setSelectedFileGroup}
  //             currentFolder={selectedFolder}
  //             onClearFolder={() => setSelectedFolder(null)}
  //           />
  //         </Grid>
  //       </Grid>
  //       {selectedFileGroup && (
  //         <Suspense fallback={null}>
  //           <FileModalAsync file={selectedFileGroup} />
  //         </Suspense>
  //       )}
  //     </>
  //   );

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
