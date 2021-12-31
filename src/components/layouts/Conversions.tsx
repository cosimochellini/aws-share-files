import { MouseEvent, useState } from "react";
import { Nullable } from "../../types/generic";
import {
  Button,
  Menu,
  MenuItem,
  Badge,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ChangeCircleRounded,
  Dangerous,
  Delete,
  LocalDining,
  Done,
  DoneOutlined,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { useConversions } from "../../hooks/conversions.hook";
import { formatter } from "../../formatters/formatter";
import { StatusCode } from "../../types/converter.types";

function getColor(code: StatusCode) {
  console.log(code);
  switch (code) {
    case StatusCode.completed:
    case StatusCode.converting:
      return "success";

    case StatusCode.failed:
      return "warning";

    default:
      return "default";
  }
}

export function Conversions() {
  const { jobs, removeConversion } = useConversions();

  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const empty = [
    <MenuItem key="1" onClick={handleClose}>
      No jobs found, start a new job to see it here
    </MenuItem>,
  ];
  return (
    <div>
      <Button
        id="conversions-menu"
        onClick={handleClick}
        sx={{ marginX: { xl: 8 } }}
        endIcon={
          <Badge
            badgeContent={
              jobs.filter((j) => j.status.code !== StatusCode.completed).length
            }
            color="secondary"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ChangeCircleRounded />
          </Badge>
        }
      >
        Conversions
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        id="conversions-menu"
        onClose={handleClose}
      >
        {jobs.length
          ? jobs.map((job) => (
              <MenuItem key={job.id}>
                <Chip
                  label={formatter.timeFormatter(job.created_at)}
                  sx={{ marginX: 1 }}
                />

                <Typography
                  variant="body2"
                  color={getColor(job.status?.code)}
                  style={{ flex: 1 }}
                >
                  {job.input[0]?.parameters?.file.split("/").at(-1)}
                </Typography>
                <IconButton>
                  {job.status?.code === StatusCode.failed ? (
                    <Warning color="warning" />
                  ) : job.status?.code === StatusCode.completed ? (
                    <CheckCircle color="success" />
                  ) : (
                    <LocalDining color="secondary" className="spin" />
                  )}
                </IconButton>
                <IconButton
                  color="error"
                  sx={{}}
                  onClick={() => removeConversion(job.id)}
                >
                  <Delete />
                </IconButton>
              </MenuItem>
            ))
          : empty}
      </Menu>
    </div>
  );
}
