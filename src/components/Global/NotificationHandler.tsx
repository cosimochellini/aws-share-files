import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

import { useEffectOnceWhen } from '../../hooks/once';
import type { notificationData } from '../../instances/notification';
import { notification } from '../../instances/notification';

const NotificationHandler = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({} as notificationData);

  const handleClose = () => {
    setOpen(false);
  };

  useEffectOnceWhen(() => {
    notification.onShow((data) => {
      setData(data);
      setOpen(true);
    });
  });

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={data.message}
      >
        <Alert
          onClose={handleClose}
          severity={data.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {data.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationHandler;
