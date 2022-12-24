import {
  Folder,
  Logout,
  Mail,
  Settings,
  Upload,
} from '@mui/icons-material';

export enum Visibility {
  All = 'All',
  Sidebar = 'Sidebar',
  BottomBar = 'BottomBar',
  Disabled = 'Disabled',
}

export const navbarItems = [
  {
    name: 'Files',
    redirect: '/files',
    icon: <Folder />,
    visibility: Visibility.All,
  },
  {
    name: 'Upload',
    redirect: '/upload',
    icon: <Upload />,
    visibility: Visibility.All,
  },
  {
    name: 'Settings',
    redirect: '/settings',
    icon: <Settings />,
    visibility: Visibility.All,
  },
  {
    name: 'Manage Email',
    redirect: '/email/manage',
    icon: <Mail />,
    visibility: Visibility.Sidebar,
  },
  {
    name: 'Logout',
    redirect: '/logout',
    icon: <Logout />,
    visibility: Visibility.Sidebar,
  },
] as const;
