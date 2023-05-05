import { useState } from 'react';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { Delete, Download, ExpandMore } from '@mui/icons-material';

import type { S3File } from '../../classes/S3File';
import { useDevice } from '../../hooks/device.hook';
import { functions } from '../../instances/functions';
import { LoadingButton } from '../Data/LoadingButton';
import { formatter } from '../../formatters/formatter';
import { downloadURI } from '../../utils/downloadHelper';
import { useRefreshFolders } from '../../store/files.store';

import { SendFileViaEmail } from './SendFileViaEmail';

type Props = {
  currentFile: S3File;
};

const downloadFile = async (key: string) => {
  const signedUrl = await functions.s3.shareableUrl({ key });
  const fileName = key.split('/')
    .at(-1);

  downloadURI(signedUrl, fileName as string);
};

export const FilesAccordion = ({ currentFile }: Props) => {
  const refreshFolders = useRefreshFolders();

  const { isMobile } = useDevice();

  const [currentExpanded, setExpanded] = useState(false as string | boolean);

  const handleChange = (panel: string) => (_: unknown, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const resetState = () => {
    setExpanded(false);
  };

  const deleteFile = async (key: string) => {
    await functions.s3.deleteFile(key);
    await refreshFolders();

    resetState();
  };

  const fileTitle = (file: S3File) => {
    const fileName = isMobile
      ? file.FileInfo.Extension.toUpperCase()
      : file.FileInfo.Name;

    return `${fileName} (${formatter.fileFormatter(file.FileSize)})`;
  };

  return (
    <Accordion
      variant="outlined"
      key={currentFile.Key}
      onChange={handleChange(currentFile.Key)}
      TransitionProps={{ unmountOnExit: true }}
      expanded={currentFile.Key === currentExpanded}
    >
      <AccordionSummary
        id={currentFile.Key}
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
      >
        <Typography
          sx={{
            width: {
              xs: '70%',
              sm: '80%',
              md: '85%',
            },
            flexShrink: 0,
          }}
        >
          {fileTitle(currentFile)}
        </Typography>

        <LoadingButton
          type="icon"
          iconProps={{
            size: 'small',
            color: 'error',
            sx: { marginX: 1 },
          }}
          icon={<Delete />}
          clickAction={() => deleteFile(currentFile.Key)}
        />

        <LoadingButton
          type="icon"
          iconProps={{
            size: 'small',
            color: 'success',
            sx: { marginX: 1 },
          }}
          icon={<Download />}
          clickAction={() => downloadFile(currentFile.Key)}
        />
      </AccordionSummary>
      <AccordionDetails>
        <SendFileViaEmail fileKey={currentFile.Key} />
      </AccordionDetails>
    </Accordion>
  );
};
