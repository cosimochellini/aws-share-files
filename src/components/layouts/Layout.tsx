import Link from "../Link";
import { AppProps } from "next/app";
import { env } from "../../instances/env";
import { useState, useEffect, forwardRef } from "react";

import { styled } from "@mui/material/styles";
import { navbarItems } from "../../instances/navbar";

import { Typography, List, IconButton } from "@mui/material";
import { Box, Drawer, CssBaseline, AppBar, Toolbar } from "@mui/material";
import { ListItemText, ListItemIcon, ListItem, Divider } from "@mui/material";

import { Menu, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { device } from "../../services/device.service";

const drawerWidth = 240;

const Main = styled("main" as any, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Layout({ Component, pageProps }: Partial<AppProps>) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  useEffect(() => {
    setOpen(!device.isMobile);
  }, []);

  return (
    <Box sx={{ display: "flex", border: 0, borderRadius: 16 }}>
      <CssBaseline />
      <MyAppBar position="fixed" open={open}>
        <Toolbar>
          {!device.isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            {env.info.appTitle}
          </Typography>
        </Toolbar>
      </MyAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader open={open}>
          <IconButton onClick={handleDrawerClose}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navbarItems.map(({ name, redirect, icon }) => (
            <ListItem
              key={name}
              button
              // eslint-disable-next-line react/display-name
              component={forwardRef((prop, ref) => (
                <Link key={name} href={redirect} {...prop} />
              ))}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {Component && <Component {...pageProps} />}
      </Main>
    </Box>
  );
}
