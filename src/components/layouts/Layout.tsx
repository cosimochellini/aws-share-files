import Link from "../Link";
import { AppProps } from "next/app";
import { env } from "../../instances/env";
import { useAuth } from "../../hooks/auth.hook";
import { useDevice } from "../../hooks/device.hook";
import { useState, useEffect, forwardRef } from "react";

import { styled } from "@mui/material/styles";
import { navbarItems, Visibility } from "../../instances/navbar";

import { Typography, List, IconButton } from "@mui/material";
import { Menu, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Drawer, CssBaseline, AppBar, Toolbar } from "@mui/material";
import { ListItemText, ListItemIcon, ListItem, Divider } from "@mui/material";
import { Conversions } from "./Conversions";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
  /* @ts-ignore */
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
  /* @ts-ignore */
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
  const {} = useAuth();
  const [open, setOpen] = useState(false);
  const { isMobile, hasWidth } = useDevice();

  useEffect(() => {
    setOpen(!isMobile && hasWidth(1200));
  }, [isMobile, hasWidth]);

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", border: 0, borderRadius: 16 }}>
      <CssBaseline />
      {/* @ts-ignore */}
      <MyAppBar position="fixed" open={open}>
        <Toolbar>
          {!isMobile && (
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
          <Typography variant="h6" noWrap component="div" style={{ flex: 1 }}>
            {env.info.appTitle}
          </Typography>
          <Conversions />
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
        {/* @ts-ignore */}
        <DrawerHeader open={open}>
          <IconButton onClick={handleDrawerClose}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navbarItems
            .filter((x) => Visibility.All === x.visibility)
            .map(({ name, redirect, icon }) => (
              <ListItem
                key={name}
                button
                component={forwardRef(function Component(prop, ref) {
                  return <Link key={name} href={redirect} {...prop} />;
                })}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          {navbarItems
            .filter((x) => Visibility.Sidebar === x.visibility)
            .map(({ name, redirect, icon }) => (
              <ListItem
                key={name}
                button
                component={forwardRef(function Component(prop, ref) {
                  return <Link key={name} href={redirect} {...prop} />;
                })}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
        </List>
        <Divider />
      </Drawer>
      {/* @ts-ignore */}
      <Main open={open}>
        <DrawerHeader />
        {Component && <Component {...pageProps} />}
      </Main>
    </Box>
  );
}
