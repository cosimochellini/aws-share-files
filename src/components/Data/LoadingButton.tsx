import { Error, Refresh } from '@mui/icons-material';
import type { ButtonProps, IconButtonProps } from '@mui/material';
import { Button, IconButton } from '@mui/material';
import type { JSX } from 'react';
import React, { useMemo, useState } from 'react';

import { notification } from '../../instances/notification';
import type { Nullable } from '../../types/generic';

type Props = {
  type?: Nullable<'button' | 'icon'>
  text?: Nullable<string>
  icon: Nullable<JSX.Element>
  buttonProps?: Nullable<ButtonProps>
  iconProps?: Nullable<IconButtonProps>
  clickAction: (event: React.SyntheticEvent) => Promise<unknown>
}

export const LoadingButton = (props: Props) => {
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

    return icon ?? <Refresh className="spin" />;
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
    <Button endIcon={currentIcon} disabled={disabled} onClick={handleClick} {...buttonProps}>
      {text}
    </Button>
  ) : (
    <IconButton color={color} disabled={disabled} onClick={handleClick} {...iconProps}>
      {currentIcon}
    </IconButton>
  );
};
