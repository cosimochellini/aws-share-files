import { useState, Suspense } from 'react';
import { Grid } from '@mui/material';
import type { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

import { withDefaultLayout } from '../layouts';
import type { S3File } from '../src/classes/S3File';
import { useDevice } from '../src/hooks/device.hook';
import { Files } from '../src/components/Files/Files';
import type { S3Folder } from '../src/classes/S3Folder';
import { useQueryString } from '../src/hooks/query.hook';
import { useAuth } from '../src/hooks/auth.hook';
import Folders from '../src/components/Files/Folders';

const FileModalAsync = dynamic(() => import('../src/components/Files/FileModal'));

const sx = {
  minHeight: {
    xs: 0,
    sm: 800,
  },
};
const gridProps = {
  sx,
  md: 6,
  xs: 12,
  item: true,
};

export const getStaticProps = (async (_) => ({ props: {} })) satisfies GetStaticProps;

const FilesPage = () => {
  const [fileKey, setFileKey] = useQueryString('fileKey');
  const [folderKey, setFolderKey] = useQueryString('folderKey');

  const [selectedFolder, setSelectedFolder] = useState<S3Folder>();
  const [selectedFileGroup, setSelectedFileGroup] = useState<S3File>();

  const onClose = () => {
    setFileKey('');
    setSelectedFileGroup(undefined);
  };

  const { hasWidth } = useDevice();

  useAuth();

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyItems="center"
        spacing={{
          xs: 0,
          sm: 2,
        }}
      >
        {hasWidth(900) && (
          <Grid {...gridProps}>
            <Folders
              folderKey={folderKey}
              setFolderKey={setFolderKey}
              onSearch={setSelectedFolder}
            />
          </Grid>
        )}
        <Grid {...gridProps}>
          <Files
            fileKey={fileKey}
            setFileKey={setFileKey}
            onSearch={setSelectedFileGroup}
            currentFolder={selectedFolder}
            onClearFolder={() => {
              setFolderKey(undefined);
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
};

export default withDefaultLayout(FilesPage);
