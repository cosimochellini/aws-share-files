import { byString, byValue } from 'sort-es';
import { useMemo, useState } from 'react';
import {
  Chip,
  Paper,
  Avatar,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  List,
} from '@mui/material';
import { AutoStories, Refresh } from '@mui/icons-material';

import { useEffectOnceWhen } from '../../hooks/once';
import type { S3Folder } from '../../classes/S3Folder';
import { LoadingButton } from '../Data/LoadingButton';
import { useQueryString } from '../../hooks/query.hook';
import { useFolders, useRefreshFolders } from '../../store/files.store';
import { FilesPlaceholders } from '../Placeholders/FilesPlaceholders';
import { sharedConfiguration } from '../../instances/sharedConfiguration';
import type { PagingConfiguration } from '../Configurations/FileListConfiguration';
import {
  FileListConfiguration,
} from '../Configurations/FileListConfiguration';
import type { S3File } from '../../classes/S3File';

import { ResultCount } from './ResultCount';

export type FilesProps = {
  fileKey?: string;
  currentFolder?: S3Folder;
  onClearFolder?: () => void;
  setFileKey: (fileKey: string) => void;
  onSearch?: (query: S3File) => void;
};

const defaultConfiguration: PagingConfiguration<S3File> = {
  size: sharedConfiguration.itemsConfiguration.maxCount,
  orderDesc: false,
  orderBy: 'FileName',
};

export const Files = ({
  fileKey,
  setFileKey,
  onSearch,
  onClearFolder,
  currentFolder,
}: FilesProps) => {
  const [search, setSearch] = useQueryString('fileSearch');
  const {
    folders,
    initialized,
  } = useFolders();

  const refreshFolders = useRefreshFolders();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const handleDeleteAuthor = () => {
    onClearFolder?.();
  };

  const handleSelectedFile = (index: number) => {
    const file = displayedItems[index];

    if (!file) return;

    onSearch?.(file);

    setFileKey(file.Key);
    setSelectedIndex(index);
  };

  const displayedItems = useMemo(() => {
    setSelectedIndex(0);

    let items = folders?.flatMap((item) => item.Files) ?? [];

    if (search) {
      const searchLower = search.trim()
        .toLowerCase();

      items = items.filter((i) => i.Key.toLowerCase()
        .includes(searchLower));
    }

    if (currentFolder) {
      items = items.filter((i) => i.FileInfo.Parent.includes(currentFolder.FolderName));
    }

    const {
      orderBy,
      orderDesc: desc,
    } = configuration;

    return items.sort(byValue(orderBy as 'Key', byString({ desc })));
  }, [search, folders, currentFolder, configuration]);

  useEffectOnceWhen(() => {
    if (fileKey && displayedItems.length) {
      const index = displayedItems.findIndex((i) => i.Key === fileKey);

      if (index < 0) return;
      handleSelectedFile(index);
    }
  }, initialized);

  return (
    <>
      <h1>Files</h1>

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: {
            xs: '88%',
            md: '88%',
          },
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <LoadingButton
                type="icon"
                icon={<Refresh />}
                clickAction={() => refreshFolders(true)}
              />
            </InputAdornment>
          ),

          startAdornment: currentFolder && (
            <Chip
              variant="outlined"
              sx={{ marginRight: '5px' }}
              onDelete={handleDeleteAuthor}
              label={`Author: ${currentFolder.FolderName}`}
            />
          ),
        }}
      />
      <FileListConfiguration
        title="Search files options"
        configuration={configuration}
        onUpdateConfiguration={setConfiguration}
        availableKeys={[
          ['Title', 'FileName'],
          ['Author', 'Parent'],
          ['Last update', 'LastModified'],
        ]}
      />
      <Paper
        style={{
          maxHeight: 700,
          overflowY: 'scroll',
          background: 'transparent',
        }}
      >
        <List
          sx={{
            width: {
              xs: '100%',
              md: '90%',
            },
          }}
        >
          {!initialized ? (
            <FilesPlaceholders count={configuration.size} />
          ) : (
            displayedItems
              .concat()
              .slice(0, configuration.size)
              .map((file, i) => (
                <ListItem
                  key={file.Key}
                  sx={{ borderRadius: 6 }}
                  selected={selectedIndex === i}
                  onClick={() => handleSelectedFile(i)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AutoStories />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={file.FileInfo.Name}
                    secondary={file.FileInfo.Parent}
                  />
                </ListItem>
              ))
          )}
        </List>
        <ResultCount
          displayName="files"
          totalItems={displayedItems.length}
          displayedItems={configuration.size}
          onClick={() => setConfiguration({
            ...configuration,
            size: configuration.size + 10,
          })}
        />
      </Paper>
    </>
  );
};
