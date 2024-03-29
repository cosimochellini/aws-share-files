import { useMemo } from 'react';
import type { ChipProps } from '@mui/material';
import { Chip, Grid } from '@mui/material';
import {
  MenuBook, Person, CalendarToday, Class,
} from '@mui/icons-material';

import { formatter } from '../../formatters/formatter';
import type { VolumeInfo } from '../../types/content.types';

type Props = {
  volume: VolumeInfo;
};

type color = ChipProps['color'];

const chipsFactory = (volume: VolumeInfo) => {
  const authors = volume.authors?.map((label) => ({
    label,
    title: label,
    icon: <Person />,
    color: 'primary' as color,
  }));

  const categories = volume.categories?.map((label) => ({
    label,
    title: label,
    icon: <Class />,
    color: 'warning' as color,
  }));

  const pageCount = volume.pageCount
    ? [
      {
        label: `${volume.pageCount} pages`,
        icon: <MenuBook />,
        color: 'success' as color,
      },
    ]
    : null;

  const publishedDate = volume.publishedDate
    ? [
      {
        label: formatter.dateFormatter(volume.publishedDate),
        icon: <CalendarToday />,
        color: 'error' as color,
      },
    ]
    : null;

  return [
    ...(authors ?? []),
    ...(categories ?? []),
    ...(pageCount ?? []),
    ...(publishedDate ?? []),
  ];
};

export const VolumeChipArray = (props: Props) => {
  const { volume } = props;

  const chips = useMemo(() => chipsFactory(volume), [volume]);

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-around"
      sx={{ paddingBottom: 2 }}
    >
      {chips.map((chip) => (
        <Grid key={chip.label} item>
          <Chip key={chip.label} {...chip} variant="outlined" />
        </Grid>
      ))}
    </Grid>
  );
};
