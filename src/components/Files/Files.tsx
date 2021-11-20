import { useEffect, useState } from "react";
import { S3Content } from "../../classes/S3Content";
import { formatter } from "../../formatters/formatter";
import { AttachFile, Search } from "@mui/icons-material";
import { AwaitedFunctionTypes } from "../../instances/functions";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";

type Props = {
  loading: boolean;
  files: AwaitedFunctionTypes["s3"]["root"];
  currentFolder: S3Content | null;
  onSearch: (query: S3Content) => void;
};

export function Files(props: Props) {
  const { loading, files, currentFolder } = props;

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as typeof files);

  useEffect(() => {
    let items = files;

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Hierarchy.some((h) => h.toLowerCase().includes(searchLower))
      );
    }

    if (currentFolder) {
      items = items.filter((i) => i.Key?.includes(currentFolder.Key!));
    }

    setDisplayedItems(items);
  }, [search, files, currentFolder]);

  return (
    <>
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
        }}
      >
        {loading
          ? FilesPlaceholders(6)
          : displayedItems
              .filter((x) => !x.IsFolder)
              .map((item, i) => (
                <ListItem
                  key={i}
                  selected={selectedIndex === i}
                  onMouseEnter={(_) => setSelectedIndex(i)}
                  onClick={() => props.onSearch(item)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AttachFile />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.FileName}
                    secondary={formatter.dateFormatter(item.LastModified)}
                  />
                </ListItem>
              ))}
      </List>
    </>
  );
}
