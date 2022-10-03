import { memo } from 'react';

import { Skeleton, Typography } from '../../barrel/mui.barrel';

type Props = {
  count: number;
};

export const FilesPlaceholders = memo((props: Props) => {
  const { count } = props;

  return (
    <>
      {new Array(count).fill(0).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
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
});
