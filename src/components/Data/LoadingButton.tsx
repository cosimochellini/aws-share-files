import { Nullable } from "../../types/generic";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Error, Refresh } from "@mui/icons-material";

type Props = {
  type?: Nullable<"button" | "icon">;
  text?: Nullable<string>;
  icon: Nullable<JSX.Element>;
  clickAction: (event: any) => Promise<unknown>;
  buttonProps?: Nullable<ButtonProps>;
  iconProps?: Nullable<IconButtonProps>;
};

export function LoadingButton(props: Props) {
  const { type = "button", text, icon, clickAction } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [color, setColor] = useState(
    props.buttonProps?.color ?? props.iconProps?.color ?? "primary"
  );
  const [disabled, setDisabled] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(icon);

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
    setCurrentIcon(icon);
    setDisabled(false);
  }, [error, icon, loading]);

  const handleClick = async (e: any) => {
    if (loading) return;

    setLoading(true);

    await clickAction(e)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {type === "button" ? (
        <Button
          endIcon={icon}
          disabled={disabled}
          onClick={handleClick}
          {...(props.buttonProps ?? {})}
        >
          {text}
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
