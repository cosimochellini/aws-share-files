import { useEffect, useState } from "react";
import { Nullable } from "../../types/generic";
import { UserEmail } from "../../types/dynamo.types";
import { functions } from "../../instances/functions";
import { LoadingButton } from "../Data/LoadingButton";
import { notification } from "../../instances/notification";
import { Mail, Send, Star } from '../../barrel/mui.icons.barrel';
import { Grid, List, ListItem, ListItemText } from "../../barrel/mui.barrel";
import { Menu, MenuItem, Typography, ListItemIcon } from "../../barrel/mui.barrel";
import { useEmailsStore } from "../../store/emails.store";

type Props = {
  fileKey: string;
};

export function SendFileViaEmail(props: Props) {
  const { fileKey } = props;
  const emails = useEmailsStore((x) => x.emails);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<Nullable<number>>();
  const [selectedEmail, setSelectedEmail] = useState<Nullable<UserEmail>>();

  const open = Boolean(anchorEl);

  useEffect(() => {
    setSelectedEmail(emails?.[selectedIndex ?? 0]);
  }, [emails, selectedEmail, selectedIndex]);

  const sendFile = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!selectedEmail) return;

    await functions.email
      .sendFile({ fileKey, to: selectedEmail.email })
      .then(() => notification.success("File sent successfully"))
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
        direction={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Grid item xs={12} md={8}>
          <List
            component="nav"
            sx={{
              border: 1,
              borderRadius: 2,
              borderColor: "gray",
            }}
            dense
          >
            <ListItem onClick={handleClickListItem}>
              <ListItemIcon>
                {selectedEmail?.default ? (
                  <Star fontSize="small" color="warning" />
                ) : (
                  <Mail fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={selectedEmail?.description}
                secondary={selectedEmail?.email}
              />
            </ListItem>
          </List>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            MenuListProps={{ role: "listbox" }}
          >
            {(emails ?? []).map((email, index) => (
              <MenuItem
                key={email.email}
                value={email.email}
                selected={index === selectedIndex}
                onClick={() => handleMenuItemClick(index)}
              >
                <ListItemIcon>
                  {email.default ? (
                    <Star fontSize="small" color="warning" />
                  ) : (
                    <Mail fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText sx={{ margin: 1 }}>
                  {email.description}
                </ListItemText>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontSize={"small"}
                  sx={{ margin: 1 }}
                >
                  {`(${email.email})`}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item xs={12} md={3}>
          <LoadingButton
            clickAction={sendFile}
            icon={<Send />}
            text="Send"
            buttonProps={{
              color: "primary",
              variant: "outlined",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
