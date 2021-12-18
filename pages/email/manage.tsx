import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useCallback, useEffect, useState } from "react";
import { byBoolean, byValue } from "sort-es";
import ListItem from "@mui/material/ListItem";
import { Button, Divider } from "@mui/material";
import { Email, Star } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import { UserEmail } from "../../src/types/dynamo.types";
import { functions } from "../../src/instances/functions";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { notification } from "../../src/instances/notification";
import { useCurrentContext } from "../../src/hooks/context.hook";
import { NewUserEmail } from "../../src/components/Form/NewUserEmail";

export default function Manage() {
  const { emails, setEmails } = useCurrentContext();
  const [indexActive, setIndexActive] = useState(-1);

  const deleteEmail = (email: UserEmail) => {
    functions.email
      .deleteEmail(email)
      .then(() => loadEmails())
      .catch(notification.error);
  };

  const loadEmails = useCallback(
    () =>
      functions.email
        .getEmails("cosimo.chellini@gmail.com")
        .then((emails) => setEmails(emails))
        .catch(notification.error),
    [setEmails]
  );

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  return (
    <>
      <h1>Manage Email</h1>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Your emails
          </Typography>
          <Divider />
          <List>
            {emails
              .sort(byValue((x) => x.default, byBoolean()))
              .map((email, i) => (
                <div key={email.pk}>
                  <ListItem
                    selected={indexActive === i}
                    onMouseEnter={() => setIndexActive(i)}
                    secondaryAction={
                      <Button
                        color="error"
                        variant="outlined"
                        sx={{ borderRadius: 99 }}
                        onClick={() => deleteEmail(email)}
                      >
                        <DeleteIcon />
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {email.default ? <Star color="warning" /> : <Email />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={email.description}
                      secondary={email.email}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Add new email
          </Typography>
          <NewUserEmail onEmailAdded={(_) => loadEmails()} />
        </Grid>
      </Grid>
    </>
  );
}
