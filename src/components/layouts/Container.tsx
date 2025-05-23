import type { ReactElement } from 'react';
import { useState, forwardRef, useMemo } from 'react';
import {
  Box,
  Drawer,
  ListItem,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  List,
  IconButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Roboto } from 'next/font/google';

import { Link } from '../Link';
import { env } from '../../instances/env';
import { useDevice } from '../../hooks/device.hook';
import { navbarItems, Visibility } from '../../instances/navbar';

import { Conversions } from './Conversions';

const drawerWidth = 240;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MyAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open: boolean
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')<{ open: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const robotoFont = Roboto({
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  weight: ['300', '400', '500'],
});

export const Container = ({ Component }: { Component: ReactElement }) => {
  const [open, setOpen] = useState<boolean>();
  const { isMobile, hasWidth } = useDevice();

  const initialOpen = useMemo(() => !isMobile && hasWidth(1200), [isMobile, hasWidth]);

  const isOpen = useMemo(() => open ?? initialOpen, [open, initialOpen]);

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        border: 0,
        borderRadius: 16,
      }}
      className={robotoFont.className}
    >
      <CssBaseline />
      <MyAppBar position="fixed" open={isOpen}>
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(isOpen && { display: 'none' }) }}
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
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
                // eslint-disable-next-line react/no-unstable-nested-components, react/display-name
                component={forwardRef((prop, _) => (
                  <Link key={name} href={redirect} {...prop} />
                ))}
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
                // eslint-disable-next-line react/no-unstable-nested-components, react/display-name
                component={forwardRef((prop, _) => (
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
      <Main open={isOpen}>
        <DrawerHeader open={isOpen} />
        {Component}
      </Main>
    </Box>
  );
};
