import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Tooltip } from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
  tooltip?: string;
}

/**
 * Universal reusable icon button component for the Lucky Wheel project
 */
const IconButton: React.FC<IconButtonProps> = ({
  children,
  tooltip,
  ...props
}) => {
  const btn = (
    <MuiIconButton
      {...props}
      sx={{
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(60, 80, 180, 0.10)',
        ...props.sx,
      }}
    >
      {children}
    </MuiIconButton>
  );
  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
};

export default IconButton;
