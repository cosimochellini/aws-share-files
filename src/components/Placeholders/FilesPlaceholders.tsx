import { randomId } from "../../utils/random";
import { Skeleton, Typography } from "@mui/material";

type Props = {
  count: number;
};

const id = randomId();

export function FilesPlaceholders(props: Props) {
  const { count } = props;

  return (
    <>
      {new Array(count).fill(0).map((_, index) => (
        <div key={index}>
          <Typography component="div" variant="h3">
            <Skeleton variant="text" />
          </Typography>
          <Typography component="div" variant="body1">
            <Skeleton variant="text" />
          </Typography>
        </div>
      ))}
    </>
  );
}
