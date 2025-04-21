import React from 'react';
import Chip from '@mui/material/Chip';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useTheme, useMediaQuery } from '@mui/material';

interface ClearAllImmunityChipProps {
  onClear: () => void;
}

const COLORS = {
  STAR_BACKGROUND: '#ffd54f',
};

const ClearAllImmunityChip: React.FC<ClearAllImmunityChipProps> = ({ onClear }) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Chip
      label="Clear All"
      onDelete={onClear}
      deleteIcon={<DeleteSweepIcon />}
      sx={{
        backgroundColor: COLORS.STAR_BACKGROUND,
        fontWeight: 600,
        '& .MuiChip-deleteIcon': {
          fontSize: isMediumScreen ? '1.02rem' : '1.1rem',
          color: '#bfa100',
          right: 4,
        },
      }}
    />
  );
};

export default ClearAllImmunityChip;
