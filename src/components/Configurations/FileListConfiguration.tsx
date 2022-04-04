import { useState } from "react";
import Modal from "@mui/material/Modal";
import { MoreVert } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { ButtonGroup, Box, Select } from "../../barrel/mui.barrel";
import { MenuItem, Grid, Button } from "../../barrel/mui.barrel";
import { FormControl, IconButton, InputLabel } from "../../barrel/mui.barrel";

const style = {
  p: 4,
  width: 400,
  top: "50%",
  left: "50%",
  boxShadow: 24,
  border: "2px solid #000",
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
  position: "absolute" as "absolute",
};

export type KeyProp<T> = [title: string, value: keyof T];

type Props<T> = {
  title: string;
  availableKeys: KeyProp<T>[];
  configuration: PagingConfiguration<T>;
  onUpdateConfiguration: (c: PagingConfiguration<T>) => void;
};

export type PagingConfiguration<T> = {
  size: number;
  orderBy: keyof T;
  orderDesc: boolean;
};

export function FileListConfiguration<T extends {}>(props: Props<T>) {
  const { availableKeys, configuration } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton sx={{ marginTop: 1 }} onClick={() => setOpen(true)}>
        <MoreVert />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {props.title}
          </Typography>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="select-order-by">Order by</InputLabel>
            <Select
              labelId="select-order-by"
              value={configuration.orderBy}
              label="Order by field"
              onChange={(e) => {
                props.onUpdateConfiguration({
                  ...configuration,
                  orderBy: e.target.value as keyof T,
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
              value={configuration.orderDesc ? "desc" : "asc"}
              label="Order direction"
              onChange={(e) => {
                props.onUpdateConfiguration({
                  ...configuration,
                  orderDesc: e.target.value === "desc",
                });
              }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => {
                    props.onUpdateConfiguration({
                      ...configuration,
                      size: configuration.size - 10,
                    });
                  }}
                >
                  - 10
                </Button>
                <Button>show {configuration.size} elements</Button>
                <Button
                  onClick={() => {
                    props.onUpdateConfiguration({
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
