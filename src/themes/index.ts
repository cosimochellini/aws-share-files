import { createTheme } from "@mui/material/styles";

const theme = {
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
  light: createTheme({
    palette: {
      mode: "light",
    },
  }),
};

export default theme;
