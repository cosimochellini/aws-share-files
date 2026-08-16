import type { ReactElement } from 'react';
import { useMemo } from 'react';
import type { ChipProps } from '@mui/material';
import { Chip, Grid } from '@mui/material';
import {
  MenuBook, Person, CalendarToday, Class,
} from '@mui/icons-material';

import { formatter } from '../../formatters/formatter';
import type { VolumeInfo } from '../../types/content.types';

export type VolumeChipArrayProps = {
  volume: VolumeInfo;
};

type color = ChipProps['color'];

// One chip per value, each labelled and titled with the value itself.
const labelChips = (values: string[] | undefined, icon: ReactElement, chipColor: color) => (
  values ?? []
).map((label) => ({
  label,
  title: label,
  icon,
  color: chipColor,
}));

// A single chip, or none at all when the volume does not carry the field.
const summaryChip = (label: string | null, icon: ReactElement, chipColor: color) => (
  label ? [{ label, icon, color: chipColor }] : []
);

const pageCountLabel = (pageCount: VolumeInfo['pageCount']) => (
  pageCount ? `${pageCount} pages` : null
);

const publishedDateLabel = (publishedDate: VolumeInfo['publishedDate']) => (
  publishedDate ? formatter.dateFormatter(publishedDate) : null
);

const chipsFactory = (volume: VolumeInfo) => [
  ...labelChips(volume.authors, <Person />, 'primary'),
  ...labelChips(volume.categories, <Class />, 'warning'),
  ...summaryChip(pageCountLabel(volume.pageCount), <MenuBook />, 'success'),
  ...summaryChip(publishedDateLabel(volume.publishedDate), <CalendarToday />, 'error'),
];

export const VolumeChipArray = (props: VolumeChipArrayProps) => {
  const { volume } = props;

  const chips = useMemo(() => chipsFactory(volume), [volume]);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 2,
      }}
    >
      {chips.map((chip) => (
        <Grid key={chip.label}>
          <Chip key={chip.label} {...chip} variant="outlined" />
        </Grid>
      ))}
    </Grid>
  );
};
