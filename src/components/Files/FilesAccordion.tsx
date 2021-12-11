import { useState } from "react";
import type { S3File } from "../../classes/S3File";
import { useDevice } from "../../hooks/device.hook";
import { SendFileViaEmail } from "./SendFileViaEmail";
import { IconButton, Typography } from "@mui/material";
import { formatter } from "../../formatters/formatter";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { Delete, Download, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

type Props = {
  currentFile: S3FileGroup;
};

const urlDownload = (key: string) => `./api/s3/download.function?key=${key}`;

export function FilesAccordion(props: Props) {
  const { currentFile } = props;

  const { isMobile } = useDevice();

  const [currentExpanded, setExpanded] = useState(false as string | boolean);

  const handleChange = (panel: string) => (_: unknown, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fileTitle = (file: S3File) => {
    const fileName = isMobile
      ? file.FileInfo.Extension.toUpperCase()
      : file.FileName;

    const size = file.Object.Size ?? 0;

    return `${fileName} (${formatter.fileFormatter(size)})`;
  };

  return (
    <>
      {currentFile.Files.map((file) => (
        <Accordion
          variant="outlined"
          key={file.file.Key}
          onChange={handleChange(file.file.Key)}
          TransitionProps={{ unmountOnExit: true }}
          expanded={file.file.Key === currentExpanded}
        >
          <AccordionSummary
            id={file.file.Key}
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
          >
            <Typography
              sx={{ width: { xs: "70%", sm: "80%", md: "85%" }, flexShrink: 0 }}
            >
              {fileTitle(file.file)}
            </Typography>

            <IconButton
              size="small"
              color="error"
              target="_blank"
              sx={{ marginX: 1 }}
              href={urlDownload(file.file.Key)}
            >
              <Delete />
            </IconButton>
            <IconButton
              size="small"
              target="_blank"
              color="success"
              sx={{ marginX: 1 }}
              href={urlDownload(file.file.Key)}
            >
              <Download />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <SendFileViaEmail fileKey={file.file.Key} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
