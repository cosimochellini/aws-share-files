import { useEffect } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Modal,
  Typography,
  CardHeader,
  Rating,
  Skeleton,
  Avatar,
} from '@mui/material';

import { ReadMore } from '../Text/ReadMore';
import type { Nullable } from '../../types/generic';
import { useDevice } from '../../hooks/device.hook';
import { VolumeChipArray } from '../Data/VolumeChipArray';
import { useEmailsStoreLoader } from '../../store/emails.store';
import { useVolumesStore } from '../../store/volumes.store';
import type { S3File } from '../../classes/S3File';

import { FilesAccordion } from './FilesAccordion';

type Props = {
  file: Nullable<S3File>;
  onClose: () => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  overflow: 'scroll',
  maxHeight: '80%',
  width: {
    xs: '95%',
    sm: '80%',
    md: '60%',
    lg: '50%',
    xl: '40%',
  },
} as const;

const FileModal = (props: Props) => {
  const { file, onClose } = props;

  const open = !!file;
  const { isDesktop } = useDevice();
  const _ = useEmailsStoreLoader();

  const [volume, getVolume] = useVolumesStore((x) => [x.volume, x.getVolume]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (file) getVolume(file.FileInfo.Name);
  }, [file, getVolume]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={volume?.title ?? file?.FileInfo.Name}
      aria-describedby={volume?.subtitle ?? file?.FileInfo.CompleteName}
    >
      <Card sx={style} variant="outlined">
        <CardHeader
          avatar={
            volume ? (
              <Avatar
                src={volume.imageLinks.thumbnail}
                sx={{ width: 56, height: 56 }}
                alt={volume.title}
              />
            ) : null
          }
          action={
            isDesktop
            && volume?.averageRating && (
              <Rating
                name="read-only"
                value={volume.averageRating}
                precision={0.5}
                readOnly
              />
            )
          }
          title={volume?.title ?? file?.FileInfo.Name}
          subheader={volume?.subtitle}
        />

        <Divider />
        <CardContent>
          {volume ? (
            <>
              <VolumeChipArray volume={volume} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
                align="justify"
              >
                <ReadMore text={volume.description} />
              </Typography>
            </>
          ) : (
            <Skeleton animation="wave" variant="text" />
          )}

          {file && <FilesAccordion currentFile={file} />}
        </CardContent>
      </Card>
    </Modal>
  );
};

export { FileModal };
export default FileModal;
