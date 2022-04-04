import { byValue, byAny } from "sort-es";
import { useEffect, useState } from "react";
import { ResultCount } from "./ResultCount";
import { Nullable } from "../../types/generic";
import { Paper } from "../../barrel/mui.barrel";
import { S3Folder } from "../../classes/S3Folder";
import { LoadingButton } from "../Data/LoadingButton";
import { formatter } from "../../formatters/formatter";
import { useQueryString } from "../../hooks/query.hook";
import { useFolderStore } from "../../store/files.store";
import { ListItem, TextField } from "../../barrel/mui.barrel";
import { Folder, Refresh } from "../../barrel/mui.icons.barrel";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { Avatar, IconButton, InputAdornment } from "../../barrel/mui.barrel";
import { ListItemAvatar, ListItemText, List } from "../../barrel/mui.barrel";
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
  folderKey: Nullable<string>;
  setFolderKey: (folderKey: Nullable<string>) => void;
  onSearch: (query: S3Folder) => void;
};

let initialLoad = true;

export default function Folders(props: Props) {
  const folders = useFolderStore((x) => x.folders);
  const refreshFolders = useFolderStore((x) => x.refreshFolders);

  const [hoveredItem, setHoveredItem] = useState(0);
  const [search, setSearch] = useQueryString("folderSearch");
  const [displayedItems, setDisplayedItems] = useState([] as S3Folder[]);
  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const handleCLick = (index: number) => {
    const folder = displayedItems[index];
    props.onSearch(folder);
    props.setFolderKey(folder?.Key ?? "");
  };

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

  useEffect(() => {
    if (props.folderKey && initialLoad) {
      const index = displayedItems.findIndex((i) => i.Key === props.folderKey);

      if (index < 0) return;

      const folder = displayedItems[index];

      props.onSearch(folder);

      initialLoad = false;
    }
  }, [displayedItems, props]);

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
                onClick={() => handleCLick(i)}
                onMouseEnter={(_) => setHoveredItem(i)}
              >
                <ListItemAvatar key={item.Key}>
                  <Avatar key={item.Key}>
                    <Folder key={item.Key} />
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
