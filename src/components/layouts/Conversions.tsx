import { MouseEvent, useState } from 'react';
import {
  Button,
  Menu,
  Chip,
  Badge,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import {
  ChangeCircleRounded,
  Delete,
  CheckCircle,
  Warning,
  Refresh,
} from '@mui/icons-material';

import { Nullable } from '../../types/generic';
import { LoadingButton } from '../Data/LoadingButton';
import { formatter } from '../../formatters/formatter';
import { StatusCode } from '../../types/converter.types';
import { useJobs } from '../../hooks/state/useJobs.state';
import { useConversionsStore } from '../../store/conversions.store';

function getColor(code: StatusCode) {
  switch (code) {
    case StatusCode.completed:
    case StatusCode.converting:
      return 'success';

    case StatusCode.failed:
      return 'warning';

    default:
      return 'default';
  }
}

export function Conversions() {
  const { jobs } = useJobs();
  const removeConversion = useConversionsStore((s) => s.removeConversion);

  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const empty = [
    <MenuItem key="1" onClick={handleClose}>
      No jobs found, start a new job to see it here
    </MenuItem>,
  ];
  return (
    <div>
      <Button
        onClick={handleClick}
        sx={{ marginX: { xl: 8 } }}
        endIcon={(
          <Badge
            badgeContent={
              jobs.filter((j) => j.status.code !== StatusCode.completed).length
            }
            color="secondary"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <ChangeCircleRounded />
          </Badge>
        )}
      >
        Conversions
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
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
                  ?.split('/')
                  .at(-1) ?? 'Unknown'}
              </Typography>
              <IconButton>
                {job.status?.code === StatusCode.failed ? (
                  <Warning color="warning" />
                ) : null}

                {job.status?.code === StatusCode.completed ? (
                  <CheckCircle color="success" />
                ) : (
                  <Refresh color="secondary" className="spin" />
                )}
              </IconButton>
              <LoadingButton
                type="icon"
                icon={<Delete />}
                iconProps={{ color: 'error' }}
                clickAction={async () => removeConversion(job.id)}
              />
            </MenuItem>
          ))
          : empty}
      </Menu>
    </div>
  );
}
