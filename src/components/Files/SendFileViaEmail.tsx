import { useEffect, useState } from "react";
import { Mail, Send, Star } from "@mui/icons-material";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu, MenuItem, Typography, ListItemIcon } from "@mui/material";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";
import { useUserEmail } from "../../hooks/state/useUserEmail.state";

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
    if (emails?.length) {
      setEmail(emails[0].email);
      setSelectedIndex(0);
    }
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
      <List component="nav" sx={{ bgcolor: "background.paper" }}>
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
        anchorEl={anchorEl}
        open={open}
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
      <Button color="primary" onClick={sendFile} variant="outlined">
        Send
        <Send sx={{ marginX: 1 }} />
      </Button>
    </>
  );
}
