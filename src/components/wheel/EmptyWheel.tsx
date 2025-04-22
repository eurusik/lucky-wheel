import React from 'react';
import { Box, Typography } from '@mui/material';
import { SIZES } from '../../constants/styleConfig';

/**
 * Placeholder component shown when there are no team members to display
 */
const EmptyWheel: React.FC = () => {
  return (
    <Box
      sx={{
        width: { xs: SIZES.WHEEL_SIZE.mobile, sm: SIZES.WHEEL_SIZE.tablet, md: SIZES.WHEEL_SIZE.desktop },
        height: { xs: SIZES.WHEEL_SIZE.mobile, sm: SIZES.WHEEL_SIZE.tablet, md: SIZES.WHEEL_SIZE.desktop },
        borderRadius: '50%',
        border: '2px dashed #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Add team members in settings to start spinning the wheel
      </Typography>
    </Box>
  );
};

export default EmptyWheel;
