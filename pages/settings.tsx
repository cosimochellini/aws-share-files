import { withDefaultLayout } from '../layouts';
import { useAuth } from '../src/hooks/auth.hook';
import { settings } from '../src/instances/settings';
import { formatter } from '../src/formatters/formatter';
import { useThemeStore } from '../src/store/theme.store';
import { navbarItems, Visibility } from '../src/instances/navbar';
import {
  Checkbox, FormControlLabel, Grid, ListItem, ListItemIcon, ListItemText, Divider, MuiLink, List,
} from '../src/barrel/mui.barrel';

function Settings() {
  const { session } = useAuth();

  const [dark, theme, toggleTheme] = useThemeStore((x) => [
    x.dark,
    x.theme,
    x.toggleTheme,
  ]);

  return (
    <>
      <h1>Settings</h1>
      <Grid
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: { xs: '100%', sm: '90%', md: '80%' } }}
      >
        <List>
          <Divider />
          {navbarItems
            .filter(({ visibility }) => Visibility.Sidebar === visibility)
            .map(({ name, redirect, icon }) => (
              <div key={name}>
                <ListItem
                  button
                  // eslint-disable-next-line react/no-unstable-nested-components
                  component={(prop) => (
                    <MuiLink key={name} href={redirect} {...prop} />
                  )}
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
        control={(
          <Checkbox
            checked={dark}
            onChange={toggleTheme}
            key={theme.palette.mode}
          />
        )}
      />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <p>
            version:
            {settings.version}
          </p>
          <p>
            email:
            {session?.user?.email}
          </p>
          <p>
            expire:
            {formatter.dateFormatter(session?.expires)}
          </p>
        </Grid>
      </Grid>
    </>
  );
}

export default withDefaultLayout(Settings);
