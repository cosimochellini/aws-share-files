import { FileUpload, UploadFile } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';

import { notification } from '../../instances/notification';
import type { Nullable } from '../../types/generic';
import { LoadingButton } from '../Data/LoadingButton';

export type UploadActionsProps = {
  hasFile: boolean;
  readyToUpload: boolean;
  onFileSelected: (input: Nullable<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
};

export const UploadActions = ({
  hasFile, readyToUpload, onFileSelected, onUpload,
}: UploadActionsProps) => (
  <Grid>
    <Button variant="contained" component="label" endIcon={<UploadFile />}>
      {hasFile ? 'Change file' : 'Select file'}
      <input hidden type="file" onChange={(e) => onFileSelected(e.target)} />
    </Button>
    {readyToUpload && (
      <LoadingButton
        text="Upload"
        icon={<FileUpload />}
        clickAction={() => onUpload()
          .then(() => notification.success('File uploaded successfully'))
          .catch(notification.error)}
        buttonProps={{
          variant: 'contained',
          color: 'success',
          sx: { marginLeft: 2 },
        }}
      />
    )}
  </Grid>
);
