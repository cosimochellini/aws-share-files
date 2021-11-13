import { useState } from "react";
import { List, ListItem } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Avatar, ListItemAvatar, ListItemText } from "@mui/material";

import type { ListObjectsOutput, Object } from "aws-sdk/clients/s3";

export default function Root() {
  const [data, setData] = useState([] as Object[]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event: any, index: number) =>
    setSelectedIndex(index);

  fetch("./api/s3/root.function")
    .then((res) => res.json())
    .then((res: ListObjectsOutput) => setData(res.Contents ?? []));

  return (
    <div>
      <h1>Hello World</h1>

      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {data.map((item, i) => (
          <ListItem
            key={i}
            selected={selectedIndex === i}
            onMouseEnter={(e) => handleListItemClick(e, i)}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.Key}
              secondary={new Date(item.LastModified ?? "").toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
