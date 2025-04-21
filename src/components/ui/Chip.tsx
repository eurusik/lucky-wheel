import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps, Tooltip } from '@mui/material';
import { CHIP } from '../../constants/styleConfig';

export interface ChipProps extends MuiChipProps {
  tooltip?: string;
}

/**
 * Universal reusable chip component for the Lucky Wheel project
 */
const Chip: React.FC<ChipProps> = ({ tooltip, sx, ...props }) => {
  const chipEl = (
    <MuiChip
      {...props}
      sx={{
        ...CHIP,
        ...sx,
      }}
    />
  );
  return tooltip ? <Tooltip title={tooltip}>{chipEl}</Tooltip> : chipEl;
};

export default Chip;
