import { useMemo, useState } from 'react';
import type { MenuItemProps } from '@mui/material';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from '@mui/material';
import { Mail, Send, Star } from '@mui/icons-material';

import type { Nullable } from '../../types/generic';
import type { UserEmail } from '../../types/dynamo.types';
import { functions } from '../../instances/functions';
import { LoadingButton } from '../Data/LoadingButton';
import { notification } from '../../instances/notification';
import { useEmailsStore } from '../../store/emails.store';

export type SendFileViaEmailProps = {
  fileKey: string
}

const EmailIcon = ({ isDefault }: { isDefault?: boolean }) => (
  isDefault ? <Star fontSize="small" color="warning" /> : <Mail fontSize="small" />
);

type EmailMenuItemProps = MenuItemProps & {
  email: UserEmail;
  onSelect: () => void;
};

/**
 * MenuList cloneElement's its children to drive the roving-tabindex pattern, injecting
 * tabIndex and autoFocus onto the active item. Those land on this wrapper rather than on
 * MenuItem, so everything it is handed has to be forwarded or keyboard navigation in the
 * dropdown breaks.
 */
const EmailMenuItem = ({ email, onSelect, ...menuItemProps }: EmailMenuItemProps) => (
  <MenuItem {...menuItemProps} value={email.email} onClick={onSelect}>
    <ListItemIcon>
      <EmailIcon isDefault={email.default} />
    </ListItemIcon>
    <ListItemText sx={{ margin: 1 }}>{email.description}</ListItemText>
    <Typography variant="subtitle2" color="text.secondary" fontSize="small" sx={{ margin: 1 }}>
      {`(${email.email})`}
    </Typography>
  </MenuItem>
);

export const SendFileViaEmail = (props: SendFileViaEmailProps) => {
  const { fileKey } = props;
  const emails = useEmailsStore((x) => x.emails);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<Nullable<number>>();
  const selectedEmail = useMemo(() => emails[selectedIndex ?? 0] ?? null, [emails, selectedIndex]);

  const open = Boolean(anchorEl);

  const sendFile = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!selectedEmail) return;

    await functions.email
      .sendFile({
        fileKey,
        to: selectedEmail.email,
      })
      .then(() => notification.success('File sent successfully'))
      .catch(notification.error);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <h4>Send file via email</h4>
      <Grid
        sx={{ marginTop: 2 }}
        container
        alignItems="center"
        justifyContent="center"
        direction={{
          xs: 'column',
          md: 'row',
        }}
        gap={2}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <List
            component="nav"
            sx={{
              border: 1,
              borderRadius: 2,
              borderColor: 'gray',
            }}
            dense
          >
            <ListItem onClick={handleClickListItem}>
              <ListItemIcon>
                <EmailIcon isDefault={selectedEmail?.default} />
              </ListItemIcon>
              <ListItemText primary={selectedEmail?.description} secondary={selectedEmail?.email} />
            </ListItem>
          </List>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            MenuListProps={{ role: 'listbox' }}
          >
            {emails.map((email, index) => (
              <EmailMenuItem
                key={email.email}
                email={email}
                selected={index === selectedIndex}
                onSelect={() => handleMenuItemClick(index)}
              />
            ))}
          </Menu>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <LoadingButton
            clickAction={sendFile}
            icon={<Send />}
            text="Send"
            buttonProps={{
              color: 'primary',
              variant: 'outlined',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
