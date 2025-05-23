import { byValue, byString } from 'sort-es';
import { useMemo, useState } from 'react';
import {
  Paper,
  ListItem,
  TextField,
  Avatar,
  InputAdornment,
  ListItemAvatar,
  ListItemText,
  List,
} from '@mui/material';
import { Folder, Refresh } from '@mui/icons-material';

import type { Nullable } from '../../types/generic';
import type { S3Folder } from '../../classes/S3Folder';
import { LoadingButton } from '../Data/LoadingButton';
import { formatter } from '../../formatters/formatter';
import { useQueryString } from '../../hooks/query.hook';
import { FilesPlaceholders } from '../Placeholders/FilesPlaceholders';
import { sharedConfiguration } from '../../instances/sharedConfiguration';
import type { PagingConfiguration } from '../Configurations/FileListConfiguration';
import {
  FileListConfiguration,
} from '../Configurations/FileListConfiguration';
import { useEffectOnceWhen } from '../../hooks/once';
import { useFolders, useRefreshFolders } from '../../store/files.store';

import { ResultCount } from './ResultCount';

const defaultConfiguration = {
  size: sharedConfiguration.itemsConfiguration.maxCount,
  orderBy: 'FolderName',
  orderDesc: false,
} as Readonly<PagingConfiguration<S3Folder>>;

type Props = {
  folderKey: Nullable<string>;
  setFolderKey: (folderKey: Nullable<string>) => void;
  onSearch: (query: S3Folder) => void;
};

const Folders = (props: Props) => {
  const {
    folders,
    initialized,
  } = useFolders();

  const refreshFolders = useRefreshFolders();
  const [search, setSearch] = useQueryString('folderSearch');

  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const {
    onSearch,
    setFolderKey,
    folderKey,
  } = props;

  const handleCLick = (index: number) => {
    const folder = displayedItems[index];

    if (!folder) return;

    onSearch(folder);
    setFolderKey(folder.Key);
  };

  const displayedItems = useMemo(() => {
    let items = [...(folders ?? [])];

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) => i.Key.toLocaleLowerCase()
        .includes(searchLower));
    }
    const {
      orderBy,
      orderDesc: desc,
    } = configuration;

    return items.sort(byValue(orderBy as 'Key', byString({ desc })));
  }, [search, folders, configuration]);

  useEffectOnceWhen(() => {
    if (folderKey) {
      const index = displayedItems.findIndex((i) => i.Key === folderKey);

      if (index < 0) return;

      const folder = displayedItems[index];

      if (!folder) return;

      onSearch(folder);
    }
  }, displayedItems.length > 0);

  return (
    <>
      <h1>Authors</h1>
      <TextField
        type="search"
        value={search}
        label="Search for author"
        sx={{
          width: {
            xs: '88%',
            md: '88%',
          },
        }}
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
        }}
      />
      <FileListConfiguration
        title="Search folders options"
        configuration={configuration}
        onUpdateConfiguration={setConfiguration}
        availableKeys={[
          ['Last update', 'LastModified'],
          ['Title', 'Key'],
        ]}
      />
      <Paper
        style={{
          maxHeight: 750,
          overflowY: 'scroll',
          background: 'transparent',
        }}
      >
        <List
          sx={{
            width: {
              xs: '100%',
              sm: '90%',
            },
          }}
        >
          {!initialized ? (
            <FilesPlaceholders count={configuration.size} />
          ) : (
            displayedItems.slice(0, configuration.size)
              .map((item, i) => (
                <ListItem
                  key={item.Key}
                  sx={{ borderRadius: 6 }}
                  onClick={() => handleCLick(i)}
                >
                  <ListItemAvatar key={item.Key}>
                    <Avatar key={item.Key}>
                      <Folder key={item.Key} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.FolderName}
                    secondary={`edited: ${formatter.dateFormatter(
                      item.LastModified,
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
          onClick={() => setConfiguration({
            ...configuration,
            size: configuration.size + 10,
          })}
        />
      </Paper>
    </>
  );
};

export default Folders;
