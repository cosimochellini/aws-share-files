import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import type { S3File } from "../../classes/S3File";
import { Button, Typography } from "@mui/material";
import { useDevice } from "../../hooks/device.hook";
import { formatter } from "../../formatters/formatter";
import { S3FileGroup } from "../../classes/S3FileGroup";
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
          TransitionProps={{ unmountOnExit: true }}
          key={file.file.Key}
          expanded={file.file.Key === currentExpanded}
          onChange={handleChange(file.file.Key)}
          variant="outlined"
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id={file.file.Key}
          >
            <Typography sx={{ width: "90%", flexShrink: 0 }}>
              {fileTitle(file.file)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              href={urlDownload(file.file.Key)}
              target="_blank"
              variant="outlined"
            >
              Download
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
