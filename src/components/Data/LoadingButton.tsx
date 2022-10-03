import React, { useMemo, useState } from 'react';
import { Nullable } from '../../types/generic';
import { notification } from '../../instances/notification';
import {
  Button, ButtonProps, IconButton, IconButtonProps,
} from '../../barrel/mui.barrel';
import { Error, Refresh } from '../../barrel/mui.icons.barrel';

type Props = {
  type?: Nullable<'button' | 'icon'>;
  text?: Nullable<string>;
  icon: Nullable<JSX.Element>;
  clickAction: (event: React.SyntheticEvent) => Promise<unknown>;
  buttonProps?: Nullable<ButtonProps>;
  iconProps?: Nullable<IconButtonProps>;
};

export function LoadingButton(props: Props) {
  const { type = 'button' } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const color = useMemo(() => {
    if (loading) return 'info';

    if (error) return 'error';

    return props.buttonProps?.color ?? props.iconProps?.color ?? 'primary';
  }, [loading, error, props.buttonProps?.color, props.iconProps?.color]);

  const currentIcon = useMemo(() => {
    if (loading) return <Refresh className="spin" />;

    if (error) return <Error />;

    return props.icon;
  }, [loading, error, props.icon]);

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

    await props
      .clickAction(e)
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  return (
    <>
      {type === 'button' ? (
        <Button
          endIcon={currentIcon}
          disabled={disabled}
          onClick={handleClick}
          {...(props.buttonProps ?? {})}
        >
          {props.text}
        </Button>
      ) : (
        <IconButton
          color={color}
          disabled={disabled}
          onClick={handleClick}
          {...(props.iconProps ?? {})}
        >
          {currentIcon}
        </IconButton>
      )}
    </>
  );
}
