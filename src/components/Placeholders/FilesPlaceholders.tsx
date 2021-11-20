import { Skeleton, Typography } from "@mui/material";

export function FilesPlaceholders(count: number) {
  return new Array(count).fill(0).map((_, i) => (
    <>
      <Typography component="div" variant="h3">
        <Skeleton variant="text" />
      </Typography>
      <Typography component="div" variant="body1">
        <Skeleton variant="text" />
      </Typography>
    </>
  ));
}
