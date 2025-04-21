import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress, Tooltip } from '@mui/material';
import { BUTTONS } from '../../constants/styleConfig';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  tooltip?: string;
}

/**
 * Universal reusable button component for the Lucky Wheel project
 */
const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  tooltip,
  ...props
}) => {
  const btn = (
    <MuiButton
      disabled={disabled || loading}
      {...props}
      sx={{
        ...BUTTONS,
        ...props.sx,
      }}
    >
      {loading ? <CircularProgress color="inherit" size={22} sx={{ mr: 1 }} /> : null}
      {children}
    </MuiButton>
  );
  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
};

export default Button;
