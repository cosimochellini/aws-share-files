import { MouseEvent, useState } from "react";
import { Button, Menu } from "@mui/material";
import { Nullable } from "../../types/generic";
import { formatter } from "../../formatters/formatter";
import { StatusCode } from "../../types/converter.types";
import { useJobs } from "../../hooks/state/useJobs.state";
import { ChangeCircleRounded, Delete } from "@mui/icons-material";
import { CheckCircle, Warning, Refresh } from "@mui/icons-material";
import { useConversions } from "../../hooks/state/useConversions.state";
import { MenuItem, Badge, Typography, IconButton, Chip } from "@mui/material";
import { unresolvedPromise } from "../../utils/promise";
import { LoadingButton } from "../Data/LoadingButton";

function getColor(code: StatusCode) {
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
  const { jobs } = useJobs();
  const { removeConversion } = useConversions();

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
                  {job.conversion?.[0]?.output_target?.[0]?.parameters?.file
                    ?.split("/")
                    .at(-1) ?? "Unknown"}
                </Typography>
                <IconButton>
                  {job.status?.code === StatusCode.failed ? (
                    <Warning color="warning" />
                  ) : job.status?.code === StatusCode.completed ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Refresh color="secondary" className="spin" />
                  )}
                </IconButton>
                <LoadingButton
                  type="icon"
                  icon={<Delete />}
                  iconProps={{ color: "error" }}
                  clickAction={() =>
                    unresolvedPromise(() => removeConversion(job.id))
                  }
                ></LoadingButton>
              </MenuItem>
            ))
          : empty}
      </Menu>
    </div>
  );
}
