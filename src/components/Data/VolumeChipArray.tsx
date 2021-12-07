import { useEffect, useState } from "react";
import { Chip, ChipProps, Grid } from "@mui/material";
import { formatter } from "../../formatters/formatter";
import { VolumeInfo } from "../../types/content.types";
import { CalendarToday, Class, MenuBook, Person } from "@mui/icons-material";

type Props = {
  volume: VolumeInfo;
};

type color = ChipProps["color"];

const chipsFactory = (volume: VolumeInfo) => {
  const authors = volume.authors?.map((label) => ({
    label,
    title: label,
    icon: <Person />,
    color: "primary" as color,
  }));

  const categories = volume.categories?.map((label) => ({
    label,
    title: label,
    icon: <Class />,
    color: "warning" as color,
  }));

  const pageCount = volume.pageCount
    ? [
        {
          label: `${volume.pageCount} pages`,
          icon: <MenuBook />,
          color: "success" as color,
        },
      ]
    : null;

  const publishedDate = volume.publishedDate
    ? [
        {
          label: formatter.dateFormatter(volume.publishedDate),
          icon: <CalendarToday />,
          color: "error" as color,
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

export function VolumeChipArray(props: Props) {
  const { volume } = props;

  const [chips, setChips] = useState(() => chipsFactory(volume));

  useEffect(() => {
    setChips(chipsFactory(volume));
  }, [volume]);

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
}
