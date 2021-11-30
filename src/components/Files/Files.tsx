import { Chip } from "@mui/material";
import { byString, byValue } from "sort-es";
import { useEffect, useState } from "react";
import { S3Folder } from "../../classes/S3Folder";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { AutoStories, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";

export type Props = {
  loading: boolean;
  folders: S3Folder[];
  currentFolder: S3Folder | null;
  onSearch?: (query: S3FileGroup) => void;
  onClearFolder?: () => void;
};

export default function Files(props: Props) {
  const { loading, folders, currentFolder } = props;

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as S3FileGroup[]);

  const handleDeleteAuthor = () => {
    props.onClearFolder?.();
  };

  useEffect(() => {
    setSelectedIndex(0);

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

    setDisplayedItems(
      items
        .flatMap((item) => item.Files)
        .sort(byValue((x) => x.FileName, byString()))
        .slice(0, 10)
    );
  }, [search, folders, currentFolder]);

  return (
    <>
      <h1>Files</h1>

      {currentFolder ? (
        <Chip
          label={"Author: " + currentFolder.FolderName}
          variant="outlined"
          onDelete={handleDeleteAuthor}
          sx={{ marginBottom: 2 }}
        />
      ) : null}

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: { xs: "100%", sm: "90%" },
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
          width: { xs: "100%", sm: "90%" },
        }}
      >
        {loading
          ? FilesPlaceholders(6)
          : displayedItems.map((file, i) => (
              <ListItem
                key={file.Key}
                selected={selectedIndex === i}
                onMouseEnter={(_) => setSelectedIndex(i)}
                onClick={() => props.onSearch?.(file)}
                sx={{ borderRadius: 6 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AutoStories />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.FileInfo[0]}
                  secondary={file.Hierarchy[0]}
                ></ListItemText>

                <Chip
                  label={file.Files.map((f) =>
                    f.extension[0].toUpperCase()
                  ).join(" ")}
                  title={file.Files.map(({ extension }) => extension).join(" ")}
                  size="small"
                  sx={{ marginX: "1px" }}
                />
              </ListItem>
            ))}
      </List>
    </>
  );
}
