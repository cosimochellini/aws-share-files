import { byValue, byAny } from "sort-es";
import { useMemo, useState } from "react";
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
import { Avatar, InputAdornment } from "../../barrel/mui.barrel";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { ListItemAvatar, ListItemText, List } from "../../barrel/mui.barrel";
import {
  PagingConfiguration,
  FileListConfiguration,
} from "../Configurations/FileListConfiguration";
import { useOnce } from "../../hooks/once";

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

export default function Folders(props: Props) {

  const [hoveredItem, setHoveredItem] = useState(0);
  const { folders, refreshFolders } = useFolderStore();
  const [search, setSearch] = useQueryString("folderSearch");
  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const handleCLick = (index: number) => {
    const folder = displayedItems[index];
    props.onSearch(folder);
    props.setFolderKey(folder?.Key ?? "");
  };

  const displayedItems = useMemo(() => {
    let items = [...(folders ?? [])];

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }
    const { orderBy, orderDesc: desc } = configuration;

    return items.sort(byValue(orderBy as any, byAny({ desc })));
  }, [search, folders, configuration]);

  useOnce(
    () => {
      if (props.folderKey) {
        const index = displayedItems.findIndex(
          (i) => i.Key === props.folderKey
        );

        if (index < 0) return;

        const folder = displayedItems[index];

        props.onSearch(folder);
      }
    },
    () => displayedItems?.length
  );

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
              <LoadingButton
                type={"icon"}
                icon={<Refresh />}
                clickAction={() => refreshFolders(true)}
              />
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
