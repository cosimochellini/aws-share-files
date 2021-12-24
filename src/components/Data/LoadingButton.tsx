import { Nullable } from "../../types/generic";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@mui/material";
import { useState } from "react";
import { Error, Refresh } from "@mui/icons-material";

type Props = {
  type?: Nullable<"button" | "icon">;
  text?: Nullable<string>;
  icon: Nullable<JSX.Element>;
  clickAction: () => Promise<unknown>;
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

  const getCurrentColor = () => {
    if (loading) return "secondary";
    if (error) return "error";
    return color;
  };

  const getCurrentIcon = () => {
    if (loading) return <Refresh className={loading ? "spin" : ""} />;
    if (error) return <Error />;
    return icon;
  };

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    clickAction()
      .then(() => {})
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {type === "button" ? (
        <Button
          {...{
            ...props.buttonProps,
            endIcon: getCurrentIcon(),
          }}
          disabled={loading}
          endIcon={icon}
          onClick={handleClick}
        >
          {text}
        </Button>
      ) : (
        <IconButton
          {...(props.iconProps ?? {})}
          onClick={handleClick}
          disabled={loading}
          color={getCurrentColor()}
        >
          {getCurrentIcon()}
        </IconButton>
      )}
    </>
  );
}
