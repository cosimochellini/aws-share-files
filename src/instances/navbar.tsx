import { Folder, Search, Settings } from "@mui/icons-material";

export const navbarItems = [
  {
    name: "Files",
    redirect: "/root",
    icon: <Folder />,
    bottomNav: true,
  },
  {
    name: "Search",
    redirect: "/search",
    icon: <Search />,
    bottomNav: true,
  },
  {
    name: "Settings",
    redirect: "/settings",
    icon: <Settings />,
    bottomNav: true,
  },
];
