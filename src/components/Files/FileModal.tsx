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
import { useVolumeGetter } from '../../store/volumes.store';
import type { S3File } from '../../classes/S3File';
import { notification } from '../../instances/notification';

import { FilesAccordion } from './FilesAccordion';

export type FileModalProps = {
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

type ModalVolume = ReturnType<typeof useVolumeGetter>['volume'];

const volumeTitle = (volume: ModalVolume, file: Nullable<S3File>) => (
  volume?.title ?? file?.FileInfo.Name
);

const volumeSubtitle = (volume: ModalVolume, file: Nullable<S3File>) => (
  volume?.subtitle ?? file?.FileInfo.CompleteName
);

const VolumeAvatar = ({ volume }: { volume: ModalVolume }) => (
  volume ? (
    <Avatar
      src={volume.imageLinks.thumbnail}
      sx={{ width: 56, height: 56 }}
      alt={volume.title}
    />
  ) : null
);

const VolumeRating = ({ rating }: { rating: Nullable<number> }) => (
  rating ? <Rating name="read-only" value={rating} precision={0.5} readOnly /> : null
);

const VolumeSummary = ({ volume }: { volume: ModalVolume }) => (
  volume ? (
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
  )
);

type FileModalHeaderProps = {
  volume: ModalVolume;
  file: Nullable<S3File>;
  showRating: boolean;
};

const FileModalHeader = ({ volume, file, showRating }: FileModalHeaderProps) => (
  <CardHeader
    avatar={<VolumeAvatar volume={volume} />}
    action={showRating ? <VolumeRating rating={volume?.averageRating} /> : null}
    title={volumeTitle(volume, file)}
    subheader={volume?.subtitle}
  />
);

const FileModal = (props: FileModalProps) => {
  const {
    file,
    onClose,
  } = props;

  const open = !!file;
  const { isDesktop } = useDevice();
  const _ = useEmailsStoreLoader();

  const {
    volume,
    getVolume,
  } = useVolumeGetter();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (file) {
      getVolume(file.FileInfo.Name)
        .catch(notification.error);
    }
  }, [file, getVolume]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={volumeTitle(volume, file)}
      aria-describedby={volumeSubtitle(volume, file)}
    >
      <Card sx={style} variant="outlined">
        <FileModalHeader volume={volume} file={file} showRating={isDesktop} />

        <Divider />
        <CardContent>
          <VolumeSummary volume={volume} />

          {file && <FilesAccordion currentFile={file} />}
        </CardContent>
      </Card>
    </Modal>
  );
};

export default FileModal;
