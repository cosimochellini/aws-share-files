import { byAny, byValue } from "sort-es";
import { useMemo, useState } from "react";
import { ResultCount } from "./ResultCount";
import { Nullable } from "../../types/generic";
import { S3Folder } from "../../classes/S3Folder";
import { Chip, Paper } from "../../barrel/mui.barrel";
import { LoadingButton } from "../Data/LoadingButton";
import { useQueryString } from "../../hooks/query.hook";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { useFolderStore } from "../../store/files.store";
import { ListItem, ListItemAvatar } from "../../barrel/mui.barrel";
import { AutoStories, Refresh } from "../../barrel/mui.icons.barrel";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { ListItemText, TextField, List } from "../../barrel/mui.barrel";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { Avatar, IconButton, InputAdornment } from "../../barrel/mui.barrel";
import {
  FileListConfiguration,
  PagingConfiguration,
} from "../Configurations/FileListConfiguration";

export type Props = {
  fileKey: Nullable<string>;
  fileGroup: Nullable<S3FileGroup>;
  currentFolder: Nullable<S3Folder>;
  onClearFolder?: () => void;
  setFileKey: (fileKey: string) => void;
  onSearch?: (query: S3FileGroup) => void;
};

const defaultConfiguration = {
  size: sharedConfiguration.itemsConfiguration.maxCount,
  orderDesc: false,
  orderBy: "FileName",
} as PagingConfiguration<S3FileGroup>;

export function Files(props: Props) {
  const { currentFolder } = props;
  const folders = useFolderStore((x) => x.folders);
  const loadFolders = useFolderStore((x) => x.loadFolders);
  const refreshFolders = useFolderStore((x) => x.refreshFolders);
  const subScribeOnDataLoaded = useFolderStore((x) => x.subscribeOnDataLoaded);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useQueryString("fileSearch");

  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const handleDeleteAuthor = () => {
    props.onClearFolder?.();
  };

  loadFolders();

  const handleSelectedFile = (index: number) => {
    const file = displayedItems[index];

    props.onSearch?.(file);

    props.setFileKey(file?.Key ?? "");
    setSelectedIndex(index);
  };

  const displayedItems = useMemo(() => {
    setSelectedIndex(0);

    let items = folders?.flatMap((item) => item.Files) ?? [];

    if (search) {
      const searchLower = search.trim().toLowerCase();

      items = items.filter((i) => i.Key?.toLowerCase().includes(searchLower));
    }

    if (currentFolder) {
      items = items.filter((i) => i.Key?.includes(currentFolder.Key!));
    }

    const { orderBy, orderDesc: desc } = configuration;

    return items.sort(byValue(orderBy as "Key", byAny({ desc })));
  }, [search, folders, currentFolder, configuration]);

  subScribeOnDataLoaded(() => {
    if (props.fileKey) {
      const index = displayedItems.findIndex((i) => i.Key === props.fileKey);

      if (index < 0) return;
      handleSelectedFile(index);
    }
  });

  return (
    <>
      <h1>Files</h1>

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: { xs: "88%", md: "88%" },
        }}
        value={search}
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

          startAdornment: currentFolder && (
            <Chip
              variant="outlined"
              sx={{ marginRight: "5px" }}
              onDelete={handleDeleteAuthor}
              label={"Author: " + currentFolder.FolderName}
            />
          ),
        }}
      />
      <FileListConfiguration
        title="Search files options"
        configuration={configuration}
        onUpdateConfiguration={setConfiguration}
        availableKeys={[
          ["Title", "FileName"],
          ["Last update", "LastModified"],
          ["Size", "Size"],
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
            width: { xs: "100%", md: "90%" },
          }}
        >
          {!folders ? (
            <FilesPlaceholders count={configuration.size} />
          ) : (
            displayedItems.slice(0, configuration.size).map((file, i) => (
              <ListItem
                key={file.Key}
                sx={{ borderRadius: 6 }}
                selected={selectedIndex === i}
                onClick={() => handleSelectedFile(i)}
                onMouseEnter={(_) => setSelectedIndex(i)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AutoStories />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.FileInfo.Name}
                  secondary={file.Hierarchy[0]}
                ></ListItemText>

                <Chip
                  size="small"
                  sx={{ marginX: "1px" }}
                  title={file.Files.map(({ extension }) => extension).join(" ")}
                  label={file.Files.map((f) =>
                    f.extension[0]?.toUpperCase()
                  ).join(" ")}
                />
              </ListItem>
            ))
          )}
        </List>
        <ResultCount
          displayName="files"
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
