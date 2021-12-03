import Box from "@mui/material/Box";
import { Files, Props } from "./Files";
import { Global } from "@emotion/react";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { CssBaseline, Grid } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 56;
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function SwipeableEdgeDrawer(
  props: Props & {
    container: Element;
    onClose: () => void;
  }
) {
  const { container, ...fileProps } = props;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    return () => fileProps.onClose();
  });

  return (
    <Grid container spacing={3}>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(70% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        container={container}
        sx={{ padding: 4, margin: 8 }}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "relative",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            padding: 1,
            left: 0,
          }}
        >
          <Puller />
          <Files {...fileProps} />
        </StyledBox>
      </SwipeableDrawer>
    </Grid>
  );
}
