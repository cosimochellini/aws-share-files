import { ReadMore } from "../Text/ReadMore";
import { useEffect, useState } from "react";
import { Nullable } from "../../types/generic";
import { FilesAccordion } from "./FilesAccordion";
import { FileConversion } from "./FileConversion";
import { Card, CardContent } from "@mui/material";
import { useDevice } from "../../hooks/device.hook";
import { functions } from "../../instances/functions";
import { VolumeInfo } from "../../types/content.types";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { VolumeChipArray } from "../Data/VolumeChipArray";
import { Divider, Modal, Typography } from "@mui/material";
import { notification } from "../../instances/notification";
import { CardHeader, Rating, Skeleton } from "@mui/material";

type Props = {
  file: Nullable<S3FileGroup>;
  onClose: () => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  overflow: "scroll",
  maxHeight: "80%",
  width: { xs: "95%", sm: "80%", md: "60%", lg: "50%", xl: "40%" },
};

function FileModal(props: Props) {
  const { file } = props;

  const { isDesktop } = useDevice();

  const open = !!props.file;

  const [volume, setVolume] = useState<Nullable<VolumeInfo>>();

  useEffect(() => {
    if (!file) return;

    functions.content
      .findFirst(`${file.FileInfo.Name}, ${file.Hierarchy[0]}`)
      .then((v) => setVolume(v))
      .catch(notification.error);
  }, [file]);

  const handleClose = () => {
    props.onClose();
  };

  return (
    <>
      {file ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby={volume?.title ?? file.FileName}
          aria-describedby={volume?.subtitle ?? file.FileName}
        >
          <Card sx={style} variant="outlined">
            {volume ? (
              <CardHeader
                action={
                  isDesktop &&
                  volume.averageRating && (
                    <Rating
                      name="read-only"
                      value={volume.averageRating}
                      precision={0.5}
                      readOnly
                    />
                  )
                }
                title={volume.title}
                subheader={volume.subtitle}
              />
            ) : (
              <Skeleton animation="wave" variant="text" height={40} />
            )}
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

              <FilesAccordion currentFile={file} />
              <FileConversion currentFile={file} />
            </CardContent>
          </Card>
        </Modal>
      ) : null}
    </>
  );
}

export { FileModal };
export default FileModal;
