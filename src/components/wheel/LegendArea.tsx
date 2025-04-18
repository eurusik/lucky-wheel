import React from 'react';
import { Box } from '@mui/material';
import WheelLegend from './WheelLegend';
import { SIZES } from '../../constants/styleConfig';

const LegendArea: React.FC = () => (
  <Box
    sx={{
      flex: '1 1 0',
      minWidth: { xs: '100%', md: 440 },
      maxWidth: { md: 480 },
      ml: { md: 7 },
      mt: { xs: 4, md: 0 },
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: { xs: 'center', md: 'flex-start' },
      bgcolor: 'transparent',
      boxShadow: 'none',
      borderRadius: { xs: 0, md: 3 },
      p: { xs: 0, md: 3 },
      minHeight: { md: SIZES.WHEEL_SIZE - 40 },
    }}
  >
    <WheelLegend />
  </Box>
);

export default LegendArea;
