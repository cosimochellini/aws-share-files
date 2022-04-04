import { useState } from "react";
import { Link } from "../../barrel/mui.barrel";
import { Nullable } from "../../types/generic";

type Props = {
  text: Nullable<string>;
  maxLength?: number;
};

export function ReadMore(props: Props) {
  const { text, maxLength = 250 } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;

  return (
    <>
      {isExpanded ? text : text.slice(0, maxLength) + "...  "}
      {text.length > maxLength && (
        <Link
          onClick={() => setIsExpanded(!isExpanded)}
          className="read-more-button"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </Link>
      )}
    </>
  );
}
