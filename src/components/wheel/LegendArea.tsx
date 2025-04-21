import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import WheelLegend from './WheelLegend';
import { SIZES, BREAKPOINTS } from '../../constants/styleConfig';

interface LegendAreaProps {
  wheelId: string;
}

const LegendArea: React.FC<LegendAreaProps> = ({ wheelId }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(BREAKPOINTS.MOBILE, BREAKPOINTS.DESKTOP));
  
  const wheelSize = isTablet ? SIZES.WHEEL_SIZE.tablet : SIZES.WHEEL_SIZE.desktop;
  
  return (
    <Box
      sx={{
        flex: '1 1 auto',
        minWidth: { 
          xs: '100%', 
          sm: '320px',
          md: 440 
        },
        maxWidth: { 
          sm: '320px',
          md: 480 
        },
        ml: { 
          sm: 3,
          md: 7 
        },
        mt: { xs: 4, sm: 0 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: { xs: 'center', sm: 'flex-start' },
        bgcolor: 'transparent',
        boxShadow: 'none',
        borderRadius: { xs: 0, sm: 3 },
        p: { xs: 0, sm: 2, md: 3 },
        minHeight: { 
          sm: isTablet ? 380 : wheelSize - 40 
        },
        height: 'auto',
        overflow: 'visible'
      }}
    >
      <WheelLegend wheelId={wheelId} />
    </Box>
  );
};

export default LegendArea;
