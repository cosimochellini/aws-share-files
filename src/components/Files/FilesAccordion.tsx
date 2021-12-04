import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { device } from "../../services/device.service";

type Props = {
  currentFile: S3FileGroup;
};

export function FilesAccordion(props: Props) {
  const { currentFile } = props;
  const [currentExpanded, setExpanded] = useState(false as string | boolean);

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const urlDownload = (key: string) => `./api/s3/download.function?key=${key}`;

  return (
    <>
      {currentFile.Files.map((file, index) => (
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
              {device.isMobile
                ? file.file.FileInfo.Extension
                : file.file.FileName}
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
