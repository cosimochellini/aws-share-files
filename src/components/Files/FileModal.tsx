import { red } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { CardHeader, CardMedia } from "@mui/material";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { IconButton, Modal, Typography } from "@mui/material";
import { Favorite, MoreVert, Share } from "@mui/icons-material";
import { Avatar, Card, CardActions, CardContent } from "@mui/material";
import { functions } from "../../instances/functions";
import { VolumeInfo } from "../../types/content.types";

type Props = {
  file: S3FileGroup | null;
};

export function FileModal(props: Props) {
  const { file } = props;

  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState({} as VolumeInfo);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(!!file);
  }, [file]);

  useEffect(() => {
    if (!file) return;

    functions.content
      .findFirst(file.FileInfo[0])
      .then((v) => setVolume(v))
      .catch(console.error);
  }, [file]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    maxHeight: "80%",
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {volume.title[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={volume.title}
          subheader={volume.subtitle}
        />
        <CardMedia
          component="img"
          height="180"
          image={volume.imageLinks.thumbnail}
          alt={volume.title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {volume.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <Favorite />
          </IconButton>
          <IconButton aria-label="share">
            <Share />
          </IconButton>
        </CardActions>
        <CardContent>
          <Typography paragraph>Method:</Typography>
        </CardContent>
      </Card>
    </Modal>
  );
}
