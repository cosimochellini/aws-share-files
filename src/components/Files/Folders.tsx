import { Paper } from "@mui/material";
import { byValue, byAny } from "sort-es";
import { useEffect, useState } from "react";
import { ResultCount } from "./ResultCount";
import { S3Folder } from "../../classes/S3Folder";
import { LoadingButton } from "../Data/LoadingButton";
import { formatter } from "../../formatters/formatter";
import { Folder as FolderIcon, Refresh } from "@mui/icons-material";
import { useS3Folders } from "../../hooks/state/useS3Folders.state";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";
import {
  FileListConfiguration,
  PagingConfiguration,
} from "../Configurations/FileListConfiguration";

const defaultConfiguration = {
  size: sharedConfiguration.itemsConfiguration.maxCount,
  orderBy: "Key",
  orderDesc: false,
} as PagingConfiguration<S3Folder>;

type Props = {
  onSearch: (query: S3Folder) => void;
};

export function Folders(props: Props) {
  const { folders, refreshFolders } = useS3Folders();

  const [search, setSearch] = useState("");
  const [hoveredItem, setHoveredItem] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as S3Folder[]);
  const [configuration, setConfiguration] = useState(defaultConfiguration);

  useEffect(() => {
    let items = [...(folders ?? [])];

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }
    const { orderBy, orderDesc: desc } = configuration;

    setDisplayedItems(items.sort(byValue(orderBy as any, byAny({ desc }))));
  }, [search, folders, configuration]);

  return (
    <>
      <h1>Authors</h1>
      <TextField
        type="search"
        value={search}
        label="Search for author"
        sx={{
          width: { xs: "88%", md: "88%" },
        }}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <LoadingButton
                  type={"icon"}
                  icon={<Refresh />}
                  clickAction={() => refreshFolders(true)}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FileListConfiguration
        title="Search folders options"
        configuration={configuration}
        onUpdateConfiguration={setConfiguration}
        availableKeys={[
          ["Last update", "LastModified"],
          ["Size", "Size"],
          ["Title", "Key"],
        ]}
      />
      <Paper
        style={{
          maxHeight: 750,
          overflowY: "scroll",
          background: "transparent",
        }}
      >
        <List
          sx={{
            width: { xs: "100%", sm: "90%" },
          }}
        >
          {!folders ? (
            <FilesPlaceholders count={configuration.size} />
          ) : (
            displayedItems.slice(0, configuration.size).map((item, i) => (
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
                  secondary={`edited: ${formatter.dateFormatter(
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
          displayedItems={configuration.size}
          onClick={() =>
            setConfiguration({
              ...configuration,
              size: configuration.size + 10,
            })
          }
        />
      </Paper>
    </>
  );
}
