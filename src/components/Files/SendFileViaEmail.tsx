import { useEffect, useState } from "react";
import { functions } from "../../instances/functions";
import { Mail, Send, Star } from "@mui/icons-material";
import { notification } from "../../instances/notification";
import { useUserEmail } from "../../hooks/state/useUserEmail.state";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Menu, MenuItem, Typography, ListItemIcon } from "@mui/material";

type Props = {
  fileKey: string;
};

export function SendFileViaEmail(props: Props) {
  const { fileKey } = props;
  const { emails } = useUserEmail();

  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!emails?.length) return;

    setEmail(emails[0].email);
    setSelectedIndex(0);
  }, [emails]);

  const sendFile = (event: any) => {
    event.preventDefault();
    if (!email) return;

    functions.email
      .sendFile(fileKey, email)
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
                {emails?.[selectedIndex]?.default ? (
                  <Star fontSize="small" color="warning" />
                ) : (
                  <Mail fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={emails?.[selectedIndex]?.description}
                secondary={emails?.[selectedIndex]?.email}
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
                <ListItemText>{email.description}</ListItemText>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontSize={"small"}
                >
                  {`(${email.email})`}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button color="primary" onClick={sendFile} variant="outlined">
            Send
            <Send sx={{ marginX: 1, margin: "auto" }} />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
