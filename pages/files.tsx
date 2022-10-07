import { lazy, useState, Suspense } from 'react';

import { withDefaultLayout } from '../layouts';
import { Grid } from '../src/barrel/mui.barrel';
import { S3Folder } from '../src/classes/S3Folder';
import { useDevice } from '../src/hooks/device.hook';
import { Files } from '../src/components/Files/Files';
import { useQueryString } from '../src/hooks/query.hook';
import { S3FileGroup } from '../src/classes/S3FileGroup';

const FolderAsync = lazy(() => import('../src/components/Files/Folders'));
const FileModalAsync = lazy(() => import('../src/components/Files/FileModal'));

const sx = { minHeight: { xs: 0, sm: 800 } };
const gridProps = {
  sx, md: 6, xs: 12, item: true,
};

function FilesPage() {
  const [fileKey, setFileKey] = useQueryString('fileKey');
  const [folderKey, setFolderKey] = useQueryString('folderKey');

  const [selectedFolder, setSelectedFolder] = useState<S3Folder>();
  const [selectedFileGroup, setSelectedFileGroup] = useState<S3FileGroup>();

  const onClose = () => {
    setFileKey('');
    setSelectedFileGroup(undefined);
  };

  const { hasWidth } = useDevice();

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyItems="center"
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
            onSearch={setSelectedFileGroup}
            currentFolder={selectedFolder}
            onClearFolder={() => {
              setFolderKey('');
              setSelectedFolder(undefined);
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

export default withDefaultLayout(FilesPage);
