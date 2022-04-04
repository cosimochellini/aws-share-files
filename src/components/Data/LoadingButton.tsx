import { Nullable } from "../../types/generic";
import React, { useEffect, useState } from "react";
import { notification } from "../../instances/notification";
import { Button, ButtonProps } from "../../barrel/mui.barrel";
import { Error, Refresh } from "../../barrel/mui.icons.barrel";
import { IconButton, IconButtonProps } from "../../barrel/mui.barrel";

type Props = {
  type?: Nullable<"button" | "icon">;
  text?: Nullable<string>;
  icon: Nullable<JSX.Element>;
  clickAction: (event: React.SyntheticEvent) => Promise<unknown>;
  buttonProps?: Nullable<ButtonProps>;
  iconProps?: Nullable<IconButtonProps>;
};

export function LoadingButton(props: Props) {
  const { type = "button" } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [color, setColor] = useState(
    props.buttonProps?.color ?? props.iconProps?.color ?? "primary"
  );
  const [disabled, setDisabled] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(props.icon);

  useEffect(() => {
    if (error) {
      setColor("error");
      setCurrentIcon(<Error />);
      setDisabled(false);
      return;
    }

    if (loading) {
      setColor("info");
      setCurrentIcon(<Refresh className="spin" />);
      setDisabled(true);
      return;
    }

    setColor("primary");
    setCurrentIcon(props.icon);
    setDisabled(false);
  }, [error, loading, props.icon]);

  const handleClick = async (e: React.SyntheticEvent) => {
    if (loading) return;

    setLoading(true);

    await props
      .clickAction(e)
      .catch((e) => {
        notification.error(e);
        setError(e);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {type === "button" ? (
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
