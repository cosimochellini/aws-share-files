import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { withDefaultLayout } from '../layouts';
import { Nullable } from '../src/types/generic';
import { purgeName } from '../src/utils/purgeName';
import { functions } from '../src/instances/functions';
import { device } from '../src/services/device.service';
import { VolumeInfo } from '../src/types/content.types';
import { useThemeStore } from '../src/store/theme.store';
import { useFolderStore } from '../src/store/files.store';
import {
  MenuItem,
  Select,
  CardHeader,
  TextField,
  Button,
  CardContent,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Card,
} from '../src/barrel/mui.barrel';
import { notification } from '../src/instances/notification';
import { truncateString } from '../src/utils/truncateString';
import {
  Book,
  FileUpload,
  Person,
  UploadFile,
} from '../src/barrel/mui.icons.barrel';
import { LoadingButton } from '../src/components/Data/LoadingButton';
import { bucketFallbackStrategy } from '../src/fallback/bucketFallbackStrategy';

const maxHeight = 48 * 4.5 + 8;
const stringLength = device.isMobile ? 30 : 80;

const fullWidth = {
  minWidth: {
    xs: '100%',
    sm: '90%',
    md: '70%',
    lg: '60%',
  },
} as const;

function Upload() {
  const theme = useThemeStore((x) => x.theme);
  const refreshFolders = useFolderStore((x) => x.refreshFolders);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [updatedName, setUpdatedName] = useState<string>();

  const [suggestedVolumes, setSuggestedVolumes] = useState([] as VolumeInfo[]);
  const [selectedVolumeIx, setSelectedVolumeIx] = useState(0);

  const fixedFileName = useMemo(
    () => updatedName ?? selectedFile?.name,
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

      const { title } = volume;
      const author = volume.authors?.[0];

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
      extension: selectedFile.name?.split('.').pop() as string,
    } as const;

    try {
      await functions.s3.uploadFile(payload);
    } catch (e) {
      await bucketFallbackStrategy(({ bucket }) => bucket.uploadFile(payload));
    }

    await refreshFolders(true);
  };

  useEffect(() => {
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
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={3} sx={fullWidth}>
          <Card variant="elevation">
            <CardHeader title="Upload a new file" />
            <CardContent>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                {selectedFile && (
                  <>
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        label="File name"
                        onChange={(e) => setUpdatedName(e.target.value)}
                        value={fixedFileName}
                      />
                    </Grid>
                    {suggestedVolumes.length > 0 && (
                      <Grid item sx={fullWidth}>
                        <FormControl fullWidth>
                          <InputLabel id="suggestions">
                            Available suggestions
                          </InputLabel>
                          <Select
                            value={selectedVolumeIx}
                            label="Available suggestions"
                            labelId="suggestions"
                            onChange={(e) => suggestionSelectHandler(e.target.value as number)}
                            MenuProps={{
                              PaperProps: { style: { maxHeight, width: 250 } },
                            }}
                          >
                            {suggestedVolumes.map((volume, index) => (
                              <MenuItem
                                value={index}
                                key={volume.title}
                                style={{
                                  fontWeight:
                                    theme.typography.fontWeightRegular,
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {volume.authors?.[0]}
                                  {' | '}
                                  {truncateString(volume.title, stringLength)}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        label="Author"
                        value={fileAuthor}
                        onChange={(e) => setFileAuthor(e.target.value)}
                        InputProps={{
                          endAdornment: <Person />,
                        }}
                      />
                    </Grid>
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={fileTitle}
                        InputProps={{
                          endAdornment: <Book />,
                        }}
                        onChange={(e) => setFileTitle(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    component="label"
                    endIcon={<UploadFile />}
                  >
                    {selectedFile ? 'Change file' : 'Select file'}
                    <input
                      hidden
                      type="file"
                      onChange={(e) => changeHandler(e.target)}
                    />
                  </Button>
                  {selectedFile && fileAuthor && fileTitle ? (
                    <LoadingButton
                      text="Upload"
                      icon={<FileUpload />}
                      clickAction={() => uploadFile()
                        .then(() => notification.success('File uploaded successfully'))
                        .catch(notification.error)}
                      buttonProps={{
                        variant: 'contained',
                        color: 'success',
                        sx: { marginLeft: 2 },
                      }}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default withDefaultLayout(Upload);
