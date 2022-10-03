import { byAny, byValue } from 'sort-es';
import { useMemo, useState } from 'react';
import { useEffectOnceWhen } from '../../hooks/once';
import { ResultCount } from './ResultCount';
import { Nullable } from '../../types/generic';
import { S3Folder } from '../../classes/S3Folder';
import {
  Chip, Paper, Avatar, InputAdornment, ListItem, ListItemAvatar, ListItemText, TextField, List,
} from '../../barrel/mui.barrel';
import { LoadingButton } from '../Data/LoadingButton';
import { useQueryString } from '../../hooks/query.hook';
import { S3FileGroup } from '../../classes/S3FileGroup';
import { useFolderStore } from '../../store/files.store';
import { AutoStories, Refresh } from '../../barrel/mui.icons.barrel';
import { FilesPlaceholders } from '../Placeholders/FilesPlaceholders';
import { sharedConfiguration } from '../../instances/sharedConfiguration';
import {
  PagingConfiguration,
  FileListConfiguration,
} from '../Configurations/FileListConfiguration';

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
  orderBy: 'FileName',
} as PagingConfiguration<S3FileGroup>;

export function Files(props: Props) {
  const { currentFolder } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useQueryString('fileSearch');
  const { folders, loadFolders, refreshFolders } = useFolderStore();
  const [configuration, setConfiguration] = useState(defaultConfiguration);

  const handleDeleteAuthor = () => {
    props.onClearFolder?.();
  };

  useEffectOnceWhen(() => {
    loadFolders();
  });

  const handleSelectedFile = (index: number) => {
    const file = displayedItems[index];

    props.onSearch?.(file);

    props.setFileKey(file?.Key ?? '');
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

    return items.sort(byValue(orderBy as 'Key', byAny({ desc })));
  }, [search, folders, currentFolder, configuration]);

  useEffectOnceWhen(() => {
    if (props.fileKey && displayedItems?.length) {
      const index = displayedItems.findIndex((i) => i.Key === props.fileKey);

      if (index < 0) return;
      handleSelectedFile(index);
    }
  }, displayedItems?.length > 0);

  return (
    <>
      <h1>Files</h1>

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: { xs: '88%', md: '88%' },
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
          ['Last update', 'LastModified'],
          ['Size', 'Size'],
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
            width: { xs: '100%', md: '90%' },
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
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AutoStories />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.FileInfo.Name}
                  secondary={file.Hierarchy[0]}
                />

                <Chip
                  size="small"
                  sx={{ marginX: '1px' }}
                  title={file.Files.map(({ extension }) => extension).join(' ')}
                  label={file.Files.map((f) => f.extension[0]?.toUpperCase()).join(' ')}
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
}
