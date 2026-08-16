import { useState } from 'react';
import { Link as MuiLink } from '@mui/material';

import type { Nullable } from '../../types/generic';

export type ReadMoreProps = {
  text: Nullable<string>;
  maxLength?: number;
};

const DEFAULT_MAX_LENGTH = 250;

const previewText = (text: string, isExpanded: boolean, maxLength: number) => (
  isExpanded ? text : `${text.slice(0, maxLength)}...  `
);

type ToggleProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

const ReadMoreToggle = ({ isExpanded, onToggle }: ToggleProps) => (
  <MuiLink onClick={onToggle} className="read-more-button">
    {isExpanded ? 'Read Less' : 'Read More'}
  </MuiLink>
);

export const ReadMore = (props: ReadMoreProps) => {
  const { text, maxLength = DEFAULT_MAX_LENGTH } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  return (
    <>
      {previewText(text, isExpanded, maxLength)}
      {text.length > maxLength && (
        <ReadMoreToggle
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      )}
    </>
  );
};
