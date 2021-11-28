import { useEffect, useState } from "react";
import { S3Folder } from "../../classes/S3Folder";
import { formatter } from "../../formatters/formatter";
import { AttachFile, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import {
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  ListItem,
} from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { byString, byValue } from "sort-es";

type Props = {
  loading: boolean;
  folders: S3Folder[];
  currentFolder: S3Folder | null;
  onSearch: (query: S3FileGroup) => void;
};

export function Files(props: Props) {
  const { loading, folders, currentFolder } = props;

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as typeof folders);

  useEffect(() => {
    let items = folders;

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
  }, [search, folders, currentFolder]);

  return (
    <>
      <h1>Files</h1>

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: "100%",
          maxWidth: 720,
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
          maxWidth: 720,
        }}
      >
        {loading
          ? FilesPlaceholders(6)
          : displayedItems
              .flatMap((item) => item.Files)
              .sort(byValue("FileName", byString()))
              .map((file, i) => (
                <ListItem
                  key={i}
                  selected={selectedIndex === i}
                  onMouseEnter={(_) => setSelectedIndex(i)}
                  onClick={() => props.onSearch(file)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AttachFile />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={file.FileInfo[0]}
                    secondary={formatter.dateFormatter(file.LastModified)}
                  ></ListItemText>

                  {file.Files.map(({ extension }) => (
                    <Chip label={extension} key={extension} size="small" />
                  ))}
                </ListItem>
              ))}
      </List>
    </>
  );
}
