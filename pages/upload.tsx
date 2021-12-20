import { useState } from "react";
import { FileCopy, UploadFile } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(
    undefined as File | undefined
  );
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event: HTMLInputElement | undefined) => {
    const file = event?.files?.[0];
    setSelectedFile(file);
    setIsFilePicked(true);
  };

  return (
    <div>
      <h1>Upload</h1>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        sx={{ width: "100%", minHeight: "100%" }}
      >
        <Grid
          item
          xs={3}
          sx={{ minWidth: { xs: "100%", sm: "90%", md: "70%", lg: "40%" } }}
        >
          <Card variant="elevation">
            <CardHeader title="Upload a new file" />
            <CardContent>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
              >
                <Grid item>
                  <TextField fullWidth label="author" />
                </Grid>
                <Grid item>
                  <TextField fullWidth label="file name" />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    component="label"
                    onChange={console.log}
                    onInput={console.log}
                  >
                    Upload File
                    <input
                      hidden
                      type="file"
                      onChange={(e) => changeHandler(e.target)}
                    />
                    <UploadFile sx={{ marginX: 2 }} />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
