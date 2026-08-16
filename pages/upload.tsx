import type { GetStaticProps } from 'next';
import {
  Card, CardContent, CardHeader, Grid,
} from '@mui/material';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { withDefaultLayout } from '../layouts';
import { FileDetails } from '../src/components/Upload/FileDetails';
import { UploadActions } from '../src/components/Upload/UploadActions';
import { fullWidth } from '../src/components/Upload/styles';
import { bucketFallbackStrategy } from '../src/fallback/bucketFallbackStrategy';
import { functions } from '../src/instances/functions';
import { notification } from '../src/instances/notification';
import { useRefreshFolders } from '../src/store/files.store';
import { useThemeStore } from '../src/store/theme.store';
import type { VolumeInfo } from '../src/types/content.types';
import type { Nullable } from '../src/types/generic';
import { purgeName } from '../src/utils/purgeName';

export const getStaticProps = (async (_) => ({ props: {} })) satisfies GetStaticProps;

const volumeFields = (volume: VolumeInfo) => ({
  title: volume.title,
  author: volume.authors?.[0],
});

const canUpload = (file: Nullable<File>, author: string, title: string) => Boolean(
  file && author && title,
);

const Upload = () => {
  const theme = useThemeStore((x) => x.theme);
  const refreshFolders = useRefreshFolders();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [updatedName, setUpdatedName] = useState<string>();

  const [suggestedVolumes, setSuggestedVolumes] = useState([] as VolumeInfo[]);
  const [selectedVolumeIx, setSelectedVolumeIx] = useState(0);

  const fixedFileName = useMemo(
    () => updatedName ?? selectedFile?.name ?? '',
    [selectedFile?.name, updatedName],
  );

  const [fileTitle, setFileTitle] = useState('');
  const [fileAuthor, setFileAuthor] = useState('');

  const changeHandler = (event: Nullable<HTMLInputElement>) => {
    const file = event?.files?.[0];

    setSelectedFile(file);
    setUpdatedName(undefined);

    if (file) {
      const purgedName = purgeName(file.name);

      functions.content
        .findAllContent(purgedName)
        .then((volumes) => setSuggestedVolumes(volumes))
        .catch(notification.error);
    }
  };

  const suggestionSelectHandler = useCallback(
    (index: number) => {
      const volume = suggestedVolumes[index];
      if (!volume) return;

      const { title, author } = volumeFields(volume);

      setSelectedVolumeIx(index);

      if (title) setFileTitle(title);
      if (author) setFileAuthor(author);
    },
    [suggestedVolumes],
  );

  const uploadFile = async () => {
    if (!selectedFile) return;

    const payload = {
      name: fileTitle,
      file: selectedFile,
      author: fileAuthor,
      extension: selectedFile.name.split('.').pop() as string,
    } as const;

    try {
      await functions.s3.uploadFile(payload);
    } catch {
      await bucketFallbackStrategy((bucket) => bucket.uploadFile(payload));
    }

    await refreshFolders(true);
  };

  useEffect(() => {
    if (!fixedFileName) return;

    const purgedName = purgeName(fixedFileName);

    functions.content
      .findAllContent(purgedName)
      .then((volumes) => setSuggestedVolumes(volumes))
      .catch(notification.error);
  }, [fixedFileName]);

  useEffect(() => {
    suggestionSelectHandler(0);
  }, [suggestionSelectHandler, suggestedVolumes]);

  return (
    <div>
      <h1>Upload</h1>
      <Grid
        container
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid size={{ xs: 3 }} sx={fullWidth}>
          <Card variant="elevation">
            <CardHeader title="Upload a new file" />
            <CardContent>
              <Grid
                container
                spacing={2}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedFile && (
                  <FileDetails
                    fileName={fixedFileName}
                    author={fileAuthor}
                    title={fileTitle}
                    volumes={suggestedVolumes}
                    selectedVolumeIx={selectedVolumeIx}
                    fontWeight={theme.typography.fontWeightRegular}
                    onFileNameChange={setUpdatedName}
                    onAuthorChange={setFileAuthor}
                    onTitleChange={setFileTitle}
                    onSuggestionSelect={suggestionSelectHandler}
                  />
                )}
                <UploadActions
                  hasFile={Boolean(selectedFile)}
                  readyToUpload={canUpload(selectedFile, fileAuthor, fileTitle)}
                  onFileSelected={changeHandler}
                  onUpload={uploadFile}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default withDefaultLayout(Upload);
