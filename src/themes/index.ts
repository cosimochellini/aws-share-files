import { createTheme } from "../barrel/mui.barrel";

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
