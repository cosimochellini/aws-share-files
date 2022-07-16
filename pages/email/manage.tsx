import { useState } from "react";
import { useEmailsStore } from "../../src/store/emails.store";
import { ListItem, Grid, List } from "../../src/barrel/mui.barrel";
import { NewUserEmail } from "../../src/components/Form/NewUserEmail";
import { LoadingButton } from "../../src/components/Data/LoadingButton";
import { Email, Star, Delete } from "../../src/barrel/mui.icons.barrel";
import { Divider, Typography, Avatar } from "../../src/barrel/mui.barrel";
import { ListItemText, ListItemAvatar } from "../../src/barrel/mui.barrel";
import { FilesPlaceholders } from "../../src/components/Placeholders/FilesPlaceholders";
import { fireOnce } from "../../src/hooks";

export default function Manage() {
  const [indexActive, setIndexActive] = useState(-1);
  const deleteEmail = useEmailsStore((x) => x.deleteEmail);
  const [emails, loadEmails] = useEmailsStore((x) => [x.emails, x.loadEmails]);

  fireOnce(loadEmails);

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
            {!emails?.length ? (
              <FilesPlaceholders count={3} />
            ) : (
              emails.map((email, i) => (
                <div key={email.pk}>
                  <ListItem
                    selected={indexActive === i}
                    onMouseEnter={() => setIndexActive(i)}
                    secondaryAction={
                      <LoadingButton
                        type={"icon"}
                        icon={<Delete />}
                        clickAction={() => deleteEmail(email)}
                        iconProps={{
                          color: "error",
                          sx: { borderRadius: 2, border: 1 },
                        }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {email.default ? <Star color="warning" /> : <Email />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      secondary={email.email}
                      primary={email.description}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))
            )}
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
