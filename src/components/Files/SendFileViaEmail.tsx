import { useState } from "react";
import { Send } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

type Props = {
  fileKey: string;
};

export function SendFileViaEmail(props: Props) {
  const { fileKey } = props;

  const [email, setEmail] = useState(null as string | null);

  const sendFile = (event: any) => {
    event.preventDefault();
    if (!email) return;

    functions.email
      .sendFile(fileKey, email)
      .then(() => notification.success("File sent successfully"))
      .catch(notification.error);
  };

  return (
    <TextField
      type="email"
      value={email}
      variant="outlined"
      label="Send file via Email"
      placeholder="Choose the email"
      onChange={(event) => setEmail(event.target.value)}
      InputProps={{
        endAdornment: (
          <IconButton color="primary" onClick={sendFile}>
            <Send />
          </IconButton>
        ),
      }}
    />
  );
}
