import { byAny, byValue } from "sort-es";
import { Chip, Paper } from "@mui/material";
import { ResultCount } from "./ResultCount";
import { Nullable } from "../../types/generic";
import { S3Folder } from "../../classes/S3Folder";
import { LoadingButton } from "../Data/LoadingButton";
import { useQueryString } from "../../hooks/query.hook";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { useCallback, useEffect, useState } from "react";
import { AutoStories, Refresh } from "@mui/icons-material";
import { useS3Folders } from "../../hooks/state/useS3Folders.state";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";
import {
  FileListConfiguration,
  PagingConfiguration,
} from "../Configurations/FileListConfiguration";

export type Props = {
  fileKey: string;
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

let initialLoad = true;

export function Files(props: Props) {
  const { currentFolder } = props;
  const { folders, refreshFolders } = useS3Folders();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useQueryString("fileSearch");

  const [configuration, setConfiguration] = useState(defaultConfiguration);
  const [displayedItems, setDisplayedItems] = useState([] as S3FileGroup[]);

  const handleDeleteAuthor = () => {
    props.onClearFolder?.();
  };

  const handleSelectedFile = useCallback(
    (index: number) => {
      const file = displayedItems[index];

      props.onSearch?.(file);

      props.setFileKey(file?.Key ?? "");
      setSelectedIndex(index);
    },
    [displayedItems, props]
  );

  useEffect(() => {
    if (props.fileKey && initialLoad) {
      const index = displayedItems.findIndex((i) => i.Key === props.fileKey);

      if (index < 0) return;
      handleSelectedFile(index);
      initialLoad = false;
    }
  }, [displayedItems, props, handleSelectedFile]);

  useEffect(() => {
    setSelectedIndex(0);

    let items = (folders ?? []).flatMap((item) => item.Files);

    if (search) {
      const searchLower = search.trim().toLowerCase();

      items = items.filter((i) => i.Key?.toLowerCase().includes(searchLower));
    }

    if (currentFolder) {
      items = items.filter((i) => i.Key?.includes(currentFolder.Key!));
    }

    const { orderBy, orderDesc: desc } = configuration;

    setDisplayedItems(items.sort(byValue(orderBy as any, byAny({ desc }))));
  }, [search, folders, currentFolder, configuration, setSelectedIndex]);

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
