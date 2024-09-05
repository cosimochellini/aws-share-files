import { Delete, Email, Star } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import { withDefaultLayout } from '../../layouts';
import { LoadingButton } from '../../src/components/Data/LoadingButton';
import { NewUserEmail } from '../../src/components/Form/NewUserEmail';
import { FilesPlaceholders } from '../../src/components/Placeholders/FilesPlaceholders';
import { useEmailsStoreLoader } from '../../src/store/emails.store';

const Manage = () => {
  const useEmailsStore = useEmailsStoreLoader();
  const emails = useEmailsStore((x) => x.emails);
  const deleteEmail = useEmailsStore((x) => x.deleteEmail);

  return (
    <>
      <h1>Manage Email</h1>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
            Your emails
          </Typography>
          <Divider />
          <List>
            {!emails.length ? (
              <FilesPlaceholders count={3} />
            ) : (
              emails.map((email) => (
                <div key={email.pk}>
                  <ListItem
                    secondaryAction={(
                      <LoadingButton
                        type="icon"
                        icon={<Delete />}
                        clickAction={() => deleteEmail(email)}
                        iconProps={{
                          color: 'error',
                          sx: { borderRadius: 2, border: 1 },
                        }}
                      />
                    )}
                  >
                    <ListItemAvatar>
                      <Avatar>{email.default ? <Star color="warning" /> : <Email />}</Avatar>
                    </ListItemAvatar>
                    <ListItemText secondary={email.email} primary={email.description} />
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
};

export default withDefaultLayout(Manage);
