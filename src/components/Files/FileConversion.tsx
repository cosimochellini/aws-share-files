import { useState } from "react";
import { env } from "../../instances/env";
import { ChangeCircle } from "@mui/icons-material";
import { LoadingButton } from "../Data/LoadingButton";
import { functions } from "../../instances/functions";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { Card, CardContent, CardHeader } from "@mui/material";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useConversions } from "../../hooks/conversions.hook";

type Props = {
  currentFile: S3FileGroup;
};

const { extensions } = env.converter;

export function FileConversion(props: Props) {
  const { currentFile } = props;

  const { addConversion } = useConversions();

  const fileExtensions = currentFile.Files.map((f) => f.extension);

  const availableExtensions = extensions.filter(
    (ext) => !fileExtensions.includes(ext)
  );

  const [file, setFile] = useState(fileExtensions[0]);
  const [target, setTarget] = useState(availableExtensions[0]);

  const convertFile = async () => {
    const f = currentFile.Files.find((f) => f.extension === file)!;

    await functions.convert
      .convert({
        file: f.file.FileInfo.CompleteName,
        target,
      })
      .then((job) => addConversion(job.id));
  };

  if (!availableExtensions.length) return null;

  return (
    <div>
      <Card variant="outlined" sx={{ padding: 2, marginTop: 3 }}>
        <CardHeader title="File conversion"></CardHeader>
        <CardContent>
          <Grid
            gap={2}
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={5} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-from">From</InputLabel>
                <Select
                  labelId="select-from"
                  label="From"
                  value={file}
                  onChange={(e) => setFile(e.target.value)}
                >
                  {fileExtensions.map((ext) => (
                    <MenuItem key={ext} value={ext}>
                      {ext}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={5} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-to">To</InputLabel>
                <Select
                  labelId="select-to"
                  label="To"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  {availableExtensions.map((ext) => (
                    <MenuItem key={ext} value={ext}>
                      {ext}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <LoadingButton
                text={`Convert`}
                icon={<ChangeCircle />}
                clickAction={convertFile}
                buttonProps={{ variant: "contained" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
