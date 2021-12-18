import { Button, Card, CardContent, Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { UserEmail } from "../../src/types/dynamo.types";
import { functions } from "../../src/instances/functions";
import { notification } from "../../src/instances/notification";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { Email, Save, Star } from "@mui/icons-material";
import { NewUserEmail } from "../../src/components/Form/NewUserEmail";
import SORT, { byBoolean, byValue } from "sort-es";

export default function Manage() {
  const [emails, setEmails] = useState([] as UserEmail[]);
  const [indexActive, setIndexActive] = useState(-1);

  const [newEmail, setNewEmail] = useState("");

  const loadEmails = () => {
    functions.email
      .getEmails("cosimo.chellini@gmail.com")
      .then((emails) => setEmails(emails))
      .catch(notification.error);
  };

  const deleteEmail = (email: UserEmail) => {
    functions.email
      .deleteEmail(email)
      .then(() => loadEmails())
      .catch(notification.error);
  };

  useEffect(() => {
    loadEmails();
  }, []);

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
          <NewUserEmail />
        </Grid>
      </Grid>
    </>
  );
}
