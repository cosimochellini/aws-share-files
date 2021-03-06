import Link from "../Link";
import { AppProps } from "next/app";
import { env } from "../../instances/env";
import { Conversions } from "./Conversions";
import { useDevice } from "../../hooks/device.hook";
import { useState, forwardRef, useMemo } from "react";
import { navbarItems, Visibility } from "../../instances/navbar";

import { styled } from "../../barrel/mui.barrel";
import { Box, Drawer, ListItem } from "../../barrel/mui.barrel";
import { CssBaseline, AppBar, Toolbar } from "../../barrel/mui.barrel";
import { Typography, List, IconButton } from "../../barrel/mui.barrel";
import { ListItemText, ListItemIcon, Divider } from "../../barrel/mui.barrel";
import { Menu, ChevronLeft, ChevronRight } from "../../barrel/mui.icons.barrel";
import { useAuth } from "../../hooks/auth.hook";
import { Nullable } from "../../types/generic";

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
  const [open, setOpen] = useState(null as Nullable<boolean>);
  const { isMobile, hasWidth } = useDevice();

  const initialOpen = useMemo(
    () => !isMobile && hasWidth(1200),
    [isMobile, hasWidth]
  );

  const isOpen = useMemo(() => {
    return open ?? initialOpen;
  }, [open, initialOpen]);


  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", border: 0, borderRadius: 16 }}>
      <CssBaseline />
      {/* @ts-ignore */}
      <MyAppBar position="fixed" open={isOpen}>
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(isOpen && { display: "none" }) }}
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
        open={isOpen}
      >
        {/* @ts-ignore */}
        <DrawerHeader open={isOpen}>
          <IconButton onClick={handleDrawerClose}>
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
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
      <Main open={isOpen}>
        <DrawerHeader />
        {/* @ts-ignore */}
        {Component && <Component {...pageProps} />}
      </Main>
    </Box>
  );
}
