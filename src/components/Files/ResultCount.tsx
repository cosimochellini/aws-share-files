import { Chip, Grid } from '../../barrel/mui.barrel';

type Props = {
  displayedItems: number;
  totalItems: number;
  displayName: string;
  onClick?: () => void;
};

export function ResultCount(props: Props) {
  const { displayedItems, totalItems } = props;
  const remainingItems = totalItems - displayedItems;
  const shouldDisplayItems = displayedItems < totalItems;

  return shouldDisplayItems ? (
    <Grid item xs={12} style={{ textAlign: 'center' }} onClick={props.onClick}>
      <Chip
        label={`${remainingItems} ${props.displayName} remaining...`}
        variant="outlined"
      />
    </Grid>
  ) : null;
}
