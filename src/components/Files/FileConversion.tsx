import { useState } from 'react';

import { env } from '../../instances/env';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '../../barrel/mui.barrel';
import { LoadingButton } from '../Data/LoadingButton';
import { functions } from '../../instances/functions';
import { S3FileGroup } from '../../classes/S3FileGroup';
import { notification } from '../../instances/notification';
import { ChangeCircle } from '../../barrel/mui.icons.barrel';
import { useConversionsStore } from '../../store/conversions.store';

type Props = {
  currentFile: S3FileGroup;
};

const { extensions } = env.converter;

export function FileConversion(props: Props) {
  const { currentFile } = props;

  const addConversion = useConversionsStore((x) => x.addConversion);

  const fileExtensions = currentFile.Files.map((f) => f.extension);

  const availableExtensions = extensions.filter(
    (ext) => !fileExtensions.includes(ext),
  );

  const [file, setFile] = useState(fileExtensions[0]);
  const [target, setTarget] = useState(availableExtensions[0]);

  const convertFile = async () => {
    const f = currentFile.Files.find((f) => f.extension === file);

    const fileKey = f?.file.Object.Key;

    if (!fileKey) {
      notification.error('No file found');

      return;
    }

    await functions.convert
      .convert({ target, file: fileKey })
      .then((job) => addConversion(job.id))
      .then(() => notification.success('Conversion started'));
  };

  if (!availableExtensions.length) return null;

  return (
    <div>
      <Card variant="outlined" sx={{ padding: 2, marginTop: 3 }}>
        <CardHeader title="File conversion" />
        <CardContent>
          <Grid
            gap={2}
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={5} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-from">From</InputLabel>
                <Select
                  labelId="select-from"
                  label="From"
                  value={file}
                  onChange={(e) => setFile(e.target.value)}
                >
                  {fileExtensions.map((ext) => (
                    <MenuItem key={ext} value={ext}>
                      {ext}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={5} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-to">To</InputLabel>
                <Select
                  labelId="select-to"
                  label="To"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  {availableExtensions.map((ext) => (
                    <MenuItem key={ext} value={ext}>
                      {ext}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <LoadingButton
                text="Convert"
                icon={<ChangeCircle />}
                clickAction={convertFile}
                buttonProps={{ variant: 'contained' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
