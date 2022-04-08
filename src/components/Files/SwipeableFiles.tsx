// import { Files, Props } from "./Files";
// import { Global } from "@emotion/react";
// import { useEffect, useState } from "react";
// import { colors } from "../../barrel/mui.icons.barrel";
// import { SwipeableDrawer } from "../../barrel/mui.barrel";
// import { Box, styled, Grid, CssBaseline } from "../../barrel/mui.barrel";

// const drawerBleeding = 56;
// const StyledBox = styled(Box)(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === "light" ? "#fff" : colors.greyColor[800],
// }));

// const Puller = styled(Box)(({ theme }) => ({
//   width: 30,
//   height: 6,
//   backgroundColor:
//     theme.palette.mode === "light"
//       ? colors.greyColor[300]
//       : colors.greyColor[900],
//   borderRadius: 3,
//   position: "absolute",
//   top: 8,
//   left: "calc(50% - 15px)",
// }));

// export default function SwipeableEdgeDrawer(
//   props: Props & {
//     container: Element;
//     onClose: () => void;
//   }
// ) {
//   const { container, ...fileProps } = props;

//   const [open, setOpen] = useState(true);

//   useEffect(() => {
//     return () => fileProps.onClose();
//   });

//   return (
//     <Grid container spacing={3}>
//       <CssBaseline />
//       <Global
//         styles={{
//           ".MuiDrawer-root > .MuiPaper-root": {
//             height: `calc(70% - ${drawerBleeding}px)`,
//             overflow: "visible",
//           },
//         }}
//       />

//       <SwipeableDrawer
//         container={container}
//         sx={{ padding: 4, margin: 8 }}
//         anchor="bottom"
//         open={open}
//         onClose={() => setOpen(false)}
//         onOpen={() => setOpen(true)}
//         swipeAreaWidth={drawerBleeding}
//         disableSwipeToOpen={false}
//         ModalProps={{
//           keepMounted: true,
//         }}
//       >
//         <StyledBox
//           sx={{
//             position: "relative",
//             top: -drawerBleeding,
//             borderTopLeftRadius: 8,
//             borderTopRightRadius: 8,
//             visibility: "visible",
//             right: 0,
//             padding: 1,
//             left: 0,
//           }}
//         >
//           <Puller />
//           <Files {...fileProps} />
//         </StyledBox>
//       </SwipeableDrawer>
//     </Grid>
//   );
// }
export const cc = 1;
