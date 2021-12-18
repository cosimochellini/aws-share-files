import { forwardRef, useEffect } from "react";
import List from "@mui/material/List";
import Link from "../src/components/Link";
import Divider from "@mui/material/Divider";
import GlobalThemes from "../src/themes/index";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { settings } from "../src/instances/settings";
import { useCurrentContext } from "../src/hooks/context.hook";
import { navbarItems, Visibility } from "../src/instances/navbar";
import { Checkbox, FormControlLabel, Grid, ListItem } from "@mui/material";
import { useDarkMode } from "../src/hooks/darkMode.hook";

export default function Settings() {
  const context = useCurrentContext();
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    context.setTheme(darkMode ? GlobalThemes.dark : GlobalThemes.light);
  }, [context, darkMode]);

  return (
    <>
      <h1>Settings</h1>
      <Grid
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: { xs: "100%", sm: "90%", md: "80%" } }}
      >
        <List>
          <Divider />
          {navbarItems
            .filter((x) => Visibility.Sidebar === x.visibility)
            .map(({ name, redirect, icon }) => (
              <div key={name}>
                <ListItem
                  button
                  component={forwardRef(function Component(prop, ref) {
                    return <Link key={name} href={redirect} {...prop} />;
                  })}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
                <Divider />
              </div>
            ))}
        </List>
      </Grid>

      <FormControlLabel
        label="Dark Mode"
        control={
          <Checkbox
            onChange={(e) => setDarkMode(e.target.checked)}
            checked={darkMode}
          />
        }
      />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <p>version: {settings.version}</p>
        </Grid>
      </Grid>
    </>
  );
}
