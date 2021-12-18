import { useContext } from "react";
import { ThemeProvider } from "@mui/system";
import { Context } from "../hooks/context.hook";

export function CustomThemeProvider(props: any) {
  const context = useContext(Context);

  return <ThemeProvider theme={context.theme}>{props.children}</ThemeProvider>;
}
