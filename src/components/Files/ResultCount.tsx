import { Chip, Grid } from '@mui/material';

type Props = {
  displayedItems: number;
  totalItems: number;
  displayName: string;
  onClick?: () => void;
};

export const ResultCount = (props: Props) => {
  const {
    displayedItems, totalItems, displayName, onClick,
  } = props;
  const remainingItems = totalItems - displayedItems;
  const shouldDisplayItems = displayedItems < totalItems;

  return shouldDisplayItems ? (
    <Grid style={{ textAlign: 'center' }} onClick={onClick} size={12}>
      <Chip
        label={`${remainingItems} ${displayName} remaining...`}
        variant="outlined"
      />
    </Grid>
  ) : null;
};
