import {
  FormControl, InputLabel, MenuItem, Select, Typography,
} from '@mui/material';

import { device } from '../../services/device.service';
import type { VolumeInfo } from '../../types/content.types';
import { truncateString } from '../../utils/truncateString';

const maxHeight = 48 * 4.5 + 8;
const stringLength = device.isMobile ? 30 : 80;

export type SuggestionSelectProps = {
  volumes: VolumeInfo[];
  selectedIndex: number;
  fontWeight: number | string | undefined;
  onSelect: (index: number) => void;
};

export const SuggestionSelect = ({
  volumes, selectedIndex, fontWeight, onSelect,
}: SuggestionSelectProps) => (
  <FormControl fullWidth>
    <InputLabel id="suggestions">Available suggestions</InputLabel>
    <Select
      value={selectedIndex}
      label="Available suggestions"
      labelId="suggestions"
      onChange={(e) => onSelect(e.target.value as number)}
      MenuProps={{ PaperProps: { style: { maxHeight, width: 250 } } }}
    >
      {volumes.map((volume, index) => (
        <MenuItem value={index} key={volume.title} style={{ fontWeight }}>
          <Typography variant="subtitle2">
            {volume.authors?.[0]}
            {' | '}
            {truncateString(volume.title, stringLength)}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
