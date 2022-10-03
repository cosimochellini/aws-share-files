import { Chip, Grid } from '../../barrel/mui.barrel';

type Props = {
  displayedItems: number;
  totalItems: number;
  displayName: string;
  onClick?: () => void;
};

export function ResultCount(props: Props) {
  const {
    displayedItems, totalItems, displayName, onClick,
  } = props;
  const remainingItems = totalItems - displayedItems;
  const shouldDisplayItems = displayedItems < totalItems;

  return shouldDisplayItems ? (
    <Grid item xs={12} style={{ textAlign: 'center' }} onClick={onClick}>
      <Chip
        label={`${remainingItems} ${displayName} remaining...`}
        variant="outlined"
      />
    </Grid>
  ) : null;
}
