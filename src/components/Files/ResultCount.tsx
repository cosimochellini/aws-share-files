import { Chip, Grid } from "../../barrel/mui.barrel";

import { useEffect, useState } from "react";

type Props = {
  displayedItems: number;
  totalItems: number;
  displayName: string;
  onClick?: () => void;
};

export function ResultCount(props: Props) {
  const { displayedItems, totalItems } = props;
  const [remainingItems, setRemainingItems] = useState(0);
  const [shouldDisplayItems, setShouldDisplayItems] = useState(false);

  useEffect(() => {
    setRemainingItems(totalItems - displayedItems);
    setShouldDisplayItems(displayedItems < totalItems);
  }, [displayedItems, totalItems]);

  return shouldDisplayItems ? (
    <Grid item xs={12} style={{ textAlign: "center" }} onClick={props.onClick}>
      <Chip
        label={`${remainingItems} ${props.displayName} remaining...`}
        variant="outlined"
      />
    </Grid>
  ) : null;
}
