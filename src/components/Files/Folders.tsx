import { useEffect, useState } from "react";
import { S3Content } from "../../classes/S3Content";
import { AwaitedFunctionTypes } from "../../instances/functions";
import { Folder as FolderIcon, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";

type Props = {
  loading: boolean;
  files: AwaitedFunctionTypes["s3"]["root"];
  onSearch: (query: S3Content) => void;
};

export function Folders(props: Props) {
  const { loading, files } = props;

  const [search, setSearch] = useState("");
  const [hoveredItem, setHoveredItem] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as typeof files);

  useEffect(() => {
    let items = files;

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }

    setDisplayedItems(items);
  }, [search, files]);

  return (
    <>
      <h1>Authors</h1>

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
        }}
      >
        {loading
          ? FilesPlaceholders(6)
          : displayedItems
              .filter((x) => x.IsFolder)
              .map((item, i) => (
                <ListItem
                  key={i}
                  selected={hoveredItem === i}
                  onMouseEnter={(_) => setHoveredItem(i)}
                  onClick={() => props.onSearch(item)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.FolderName}
                    secondary={new Date(
                      item.LastModified ?? ""
                    ).toLocaleString()}
                  />
                </ListItem>
              ))}
      </List>
    </>
  );
}
