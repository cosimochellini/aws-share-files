import { Book, Person } from '@mui/icons-material';
import { Grid, TextField } from '@mui/material';

import type { VolumeInfo } from '../../types/content.types';

import { SuggestionSelect } from './SuggestionSelect';
import { fullWidth } from './styles';

export type FileDetailsProps = {
  fileName: string;
  author: string;
  title: string;
  volumes: VolumeInfo[];
  selectedVolumeIx: number;
  fontWeight: number | string | undefined;
  onFileNameChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onSuggestionSelect: (index: number) => void;
};

export const FileDetails = ({
  fileName,
  author,
  title,
  volumes,
  selectedVolumeIx,
  fontWeight,
  onFileNameChange,
  onAuthorChange,
  onTitleChange,
  onSuggestionSelect,
}: FileDetailsProps) => (
  <>
    <Grid sx={fullWidth}>
      <TextField
        fullWidth
        label="File name"
        onChange={(e) => onFileNameChange(e.target.value)}
        value={fileName}
      />
    </Grid>
    {volumes.length > 0 && (
      <Grid sx={fullWidth}>
        <SuggestionSelect
          volumes={volumes}
          selectedIndex={selectedVolumeIx}
          fontWeight={fontWeight}
          onSelect={onSuggestionSelect}
        />
      </Grid>
    )}
    <Grid sx={fullWidth}>
      <TextField
        fullWidth
        label="Author"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        InputProps={{ endAdornment: <Person /> }}
      />
    </Grid>
    <Grid sx={fullWidth}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        InputProps={{ endAdornment: <Book /> }}
        onChange={(e) => onTitleChange(e.target.value)}
      />
    </Grid>
  </>
);
