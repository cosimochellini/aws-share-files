import { useEffect, useState } from "react";
import { S3Content } from "../src/classes/S3Content";
import { Folder, Search } from "@mui/icons-material";
import { functions } from "../src/instances/functions";
import { IconButton, InputAdornment, List, ListItem } from "@mui/material";
import { Avatar, ListItemAvatar, ListItemText, TextField } from "@mui/material";

export default function Root() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([] as S3Content[]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as S3Content[]);

  const handleListItemClick = (_: any, index: number) =>
    setSelectedIndex(index);

  useEffect(() => {
    functions.s3.root.then((res) => setData(res));
  }, []);

  useEffect(() => {
    let items = data;

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }
    setDisplayedItems(items);
  }, [search, data]);

  return (
    <div>
      <h1>Files</h1>
      <TextField
        label="Search for author"
        type="search"
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          borderColor: "black",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          borderColor: "black",
        }}
      >
        {displayedItems
          .filter((x) => x.IsFolder)
          .map((item, i) => (
            <ListItem
              key={i}
              selected={selectedIndex === i}
              onMouseEnter={(e) => handleListItemClick(e, i)}
            >
              <ListItemAvatar>
                <Avatar>
                  <Folder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.FolderName}
                secondary={new Date(item.LastModified ?? "").toLocaleString()}
              />
            </ListItem>
          ))}
      </List>
    </div>
  );
}
