import React, { useMemo, useState } from 'react';
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from '@mui/material';
import { Error, Refresh } from '@mui/icons-material';

import { Nullable } from '../../types/generic';
import { notification } from '../../instances/notification';

type Props = {
  type?: Nullable<'button' | 'icon'>;
  text?: Nullable<string>;
  icon: Nullable<JSX.Element>;
  buttonProps?: Nullable<ButtonProps>;
  iconProps?: Nullable<IconButtonProps>;
  clickAction: (event: React.SyntheticEvent) => Promise<unknown>;
};

export function LoadingButton(props: Props) {
  const {
    type = 'button', buttonProps, icon, iconProps, clickAction, text,
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const color = useMemo(() => {
    if (loading) return 'info';

    if (error) return 'error';

    return buttonProps?.color ?? iconProps?.color ?? 'primary';
  }, [loading, error, buttonProps?.color, iconProps?.color]);

  const currentIcon = useMemo(() => {
    if (loading) return <Refresh className="spin" />;

    if (error) return <Error />;

    return icon;
  }, [loading, error, icon]);

  const disabled = useMemo(() => {
    if (loading) return true;

    if (error) return false;

    return false;
  }, [loading, error]);

  const handleError = (error: unknown) => {
    notification.error(error);
    setError(error);
  };

  const handleClick = async (e: React.SyntheticEvent) => {
    if (loading) return;

    setLoading(true);

    await clickAction(e)
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  return type === 'button' ? (
    <Button
      endIcon={currentIcon}
      disabled={disabled}
      onClick={handleClick}
      {...buttonProps}
    >
      {text}
    </Button>
  ) : (
    <IconButton
      color={color}
      disabled={disabled}
      onClick={handleClick}
      {...iconProps}
    >
      {currentIcon}
    </IconButton>
  );
}
