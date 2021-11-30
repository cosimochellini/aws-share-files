import { Skeleton, Typography } from "@mui/material";

export function FilesPlaceholders(count: number) {
  return new Array(count).fill(0).map((_, i) => (
    <>
      <Typography component="div" variant="h3" key={i * 2}>
        <Skeleton variant="text" />
      </Typography>
      <Typography component="div" variant="body1" key={(i + 1) * 2}>
        <Skeleton variant="text" />
      </Typography>
    </>
  ));
}
