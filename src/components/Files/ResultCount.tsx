import { Chip, Grid } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  displayedItems: number;
  totalItems: number;
  displayName: string;
};

export function ResultCount(props: Props) {
  const { displayedItems, totalItems } = props;
  const [shouldDisplayItems, setShouldDisplayItems] = useState(false);
  const [remainingItems, setRemainingItems] = useState(0);

  useEffect(() => {
    setShouldDisplayItems(displayedItems < totalItems);
    setRemainingItems(totalItems - displayedItems);
  }, [displayedItems, totalItems]);

  return shouldDisplayItems ? (
    <Grid item xs={12} style={{ textAlign: "center" }}>
      <Chip
        label={`${remainingItems} ${props.displayName} remaining...`}
        variant="outlined"
      />
    </Grid>
  ) : null;
}
