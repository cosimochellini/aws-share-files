import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import type { S3 } from "aws-sdk";

export default function Root() {
  const [data, setData] = useState([] as S3.Types.Object[]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event: any, index: number) =>
    setSelectedIndex(index);

  fetch("./api/s3/root.function")
    .then((res) => res.json())
    .then((res: S3.Types.ListObjectsOutput) => setData(res.Contents ?? []));

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
