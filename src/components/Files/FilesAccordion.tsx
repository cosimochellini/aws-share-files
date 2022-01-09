import { useState } from "react";
import { Typography } from "@mui/material";
import type { S3File } from "../../classes/S3File";
import { useDevice } from "../../hooks/device.hook";
import { functions } from "../../instances/functions";
import { LoadingButton } from "../Data/LoadingButton";
import { SendFileViaEmail } from "./SendFileViaEmail";
import { formatter } from "../../formatters/formatter";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { downloadURI } from "../../utils/downloadHelper";
import { Delete, Download, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useS3Folders } from "../../hooks/state/useS3Folders.state";

type Props = {
  currentFile: S3FileGroup;
};

const downloadFile = async (key: string) => {
  const { signedUrl } = await functions.s3.shareableUrl({ key });
  const fileName = key.split("/").at(-1);

  downloadURI(signedUrl, fileName!);
};

export function FilesAccordion(props: Props) {
  const { currentFile } = props;

  const { refreshFolders } = useS3Folders();

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

            <LoadingButton
              type={"icon"}
              iconProps={{ size: "small", color: "error", sx: { marginX: 1 } }}
              icon={<Delete />}
              clickAction={() => deleteFile(file.file.Key)}
            />

            <LoadingButton
              type={"icon"}
              iconProps={{
                size: "small",
                color: "success",
                sx: { marginX: 1 },
              }}
              icon={<Download />}
              clickAction={() => downloadFile(file.file.Key)}
            />
          </AccordionSummary>
          <AccordionDetails>
            <SendFileViaEmail fileKey={file.file.Key} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
