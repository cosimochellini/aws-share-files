import { useState } from 'react';
import {
  ButtonGroup,
  Box,
  Select,
  Modal,
  MenuItem,
  Grid,
  Button,
  Typography,
  FormControl,
  IconButton,
  InputLabel,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

import type { Nullable } from '../../types/generic';

const style = {
  p: 4,
  width: 400,
  top: '50%',
  left: '50%',
  boxShadow: 24,
  border: '2px solid #000',
  bgcolor: 'background.paper',
  transform: 'translate(-50%, -50%)',
  position: 'absolute',
} as const;

export type CorrectKeyProp<T> = NonNullable<{
  [key in keyof T]: T[key] extends Nullable<(string | number | Date)> ? key : never
}>[keyof T]

export type KeyProp<T> = [title: string, value: CorrectKeyProp<T>];

type Props<T> = {
  title: string;
  availableKeys: KeyProp<T>[];
  configuration: PagingConfiguration<T>;
  onUpdateConfiguration: (c: PagingConfiguration<T>) => void;
};

export type PagingConfiguration<T> = {
  size: number;
  orderBy: CorrectKeyProp<T>;
  orderDesc: boolean;
};

// eslint-disable-next-line react/function-component-definition
export function FileListConfiguration<T>(props: Props<T>) {
  const {
    availableKeys,
    configuration,
    title,
    onUpdateConfiguration,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton sx={{ marginTop: 1 }} onClick={() => setOpen(true)}>
        <MoreVert />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="select-order-by">Order by</InputLabel>
            <Select
              labelId="select-order-by"
              value={configuration.orderBy}
              label="Order by field"
              onChange={(e) => {
                onUpdateConfiguration({
                  ...configuration,
                  orderBy: e.target.value as CorrectKeyProp<T>,
                });
              }}
            >
              {availableKeys.map(([key, value]) => (
                <MenuItem key={key} value={value as string}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="select-order-direction">Order direction</InputLabel>
            <Select
              labelId="select-order-direction"
              value={configuration.orderDesc ? 'desc' : 'asc'}
              label="Order direction"
              onChange={(e) => {
                onUpdateConfiguration({
                  ...configuration,
                  orderDesc: e.target.value === 'desc',
                });
              }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => {
                    onUpdateConfiguration({
                      ...configuration,
                      size: configuration.size - 10,
                    });
                  }}
                >
                  - 10
                </Button>
                <Button>{`show ${configuration.size} elements`}</Button>
                <Button
                  onClick={() => {
                    onUpdateConfiguration({
                      ...configuration,
                      size: configuration.size + 10,
                    });
                  }}
                >
                  + 10
                </Button>
              </ButtonGroup>
            </Grid>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
}
