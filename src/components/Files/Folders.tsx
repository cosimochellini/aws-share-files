import { ResultCount } from "./ResultCount";
import { byValue, byString } from "sort-es";
import { useEffect, useState } from "react";
import { S3Folder } from "../../classes/S3Folder";
import { formatter } from "../../formatters/formatter";
import { Folder as FolderIcon, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";

type Props = {
  loading: boolean;
  folders: S3Folder[];
  onSearch: (query: S3Folder) => void;
};

const { itemsConfiguration } = sharedConfiguration;

export function Folders(props: Props) {
  const { loading, folders } = props;

  const [search, setSearch] = useState("");
  const [hoveredItem, setHoveredItem] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as typeof folders);

  useEffect(() => {
    let items = folders;

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }

    setDisplayedItems(items.sort(byValue((x) => x.FolderName, byString())));
  }, [search, folders]);

  return (
    <>
      <h1>Authors</h1>

      <TextField
        type="search"
        value={search}
        label="Search for author"
        sx={{
          width: { xs: "100%", sm: "90%" },
        }}
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
          width: { xs: "100%", sm: "90%" },
        }}
      >
        {loading ? (
          <FilesPlaceholders count={itemsConfiguration.maxCount} />
        ) : (
          displayedItems
            .slice(0, itemsConfiguration.maxCount)
            .map((item, i) => (
              <ListItem
                key={item.Key}
                sx={{ borderRadius: 6 }}
                selected={hoveredItem === i}
                onClick={() => props.onSearch(item)}
                onMouseEnter={(_) => setHoveredItem(i)}
              >
                <ListItemAvatar key={item.Key}>
                  <Avatar key={item.Key}>
                    <FolderIcon key={item.Key} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.FolderName}
                  secondary={`edited: ${formatter.relativeFormatter(
                    item.LastModified
                  )}`}
                />
              </ListItem>
            ))
        )}
      </List>
      <ResultCount
        displayName="authors"
        totalItems={displayedItems.length}
        displayedItems={itemsConfiguration.maxCount}
      />
    </>
  );
}
