import { ReadMore } from "../Text/ReadMore";
import { useEffect, useState } from "react";
import { FilesAccordion } from "./FilesAccordion";
import { Modal, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { functions } from "../../instances/functions";
import { VolumeInfo } from "../../types/content.types";
import { device } from "../../services/device.service";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { CardHeader, Rating, Skeleton } from "@mui/material";

type Props = {
  file: S3FileGroup | null;
};

export function FileModal(props: Props) {
  const { file } = props;

  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(null as VolumeInfo | null);

  const handleClose = () => {
    setOpen(false);
    setVolume(null);
  };

  useEffect(() => {
    setOpen(!!file);

    if (!file) return;

    functions.content
      .findFirst(`${file.FileInfo.Name}, ${file.Hierarchy[0]}`)
      .then((v) => setVolume(v))
      .catch(console.error);
  }, [file]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    maxHeight: "80%",
    width: { xs: "95%", sm: "80%", md: "60%", lg: "50%", xl: "40%" },
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
                  device.isDesktop &&
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
                subheader={`${volume.authors?.join(", ")}, ${
                  volume.subtitle ?? ""
                }`}
              />
            ) : (
              <Skeleton animation="wave" variant="text" height={40} />
            )}
            <CardContent>
              {volume ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: 3 }}
                  align="justify"
                >
                  <ReadMore text={volume.description} />
                </Typography>
              ) : (
                <Skeleton animation="wave" variant="text" />
              )}
              <FilesAccordion currentFile={file} />
            </CardContent>
          </Card>
        </Modal>
      ) : null}
    </>
  );
}
