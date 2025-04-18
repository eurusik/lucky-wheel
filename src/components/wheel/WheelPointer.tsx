import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { COLORS, SIZES, BREAKPOINTS } from '../../constants/styleConfig';

/**
 * Pointer component that indicates the winning sector on the wheel
 */
interface WheelPointerProps {
  isSpinning?: boolean;
}

const WheelPointer: React.FC<WheelPointerProps> = ({ isSpinning = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));
  const isTablet = useMediaQuery(theme.breakpoints.between(BREAKPOINTS.MOBILE, BREAKPOINTS.DESKTOP));
  
  const pointerWidth = isMobile 
    ? SIZES.POINTER_WIDTH.mobile 
    : isTablet 
    ? SIZES.POINTER_WIDTH.tablet 
    : SIZES.POINTER_WIDTH.desktop;
    
  const pointerHeight = isMobile 
    ? SIZES.POINTER_HEIGHT.mobile 
    : isTablet 
    ? SIZES.POINTER_HEIGHT.tablet 
    : SIZES.POINTER_HEIGHT.desktop;

  return (
    <Box
      id="wheel-pointer"
      data-testid="wheel-pointer"
      sx={{
        position: 'absolute',
        top: { xs: 15, sm: 20, md: 25 },
        left: '50%',
        transform: 'translateX(-50%)',
        width: pointerWidth,
        height: pointerHeight,
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.POINTER,
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
          boxShadow: '0 6px 16px 2px rgba(233,30,99,0.22)',
          border: '4px solid #fff',
          borderRadius: '6px',
          transition: 'box-shadow 0.3s',
          animation: isSpinning ? 'wiggle 0.5s infinite linear' : 'none',
        },
        '@keyframes wiggle': {
          '0%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
          '100%': { transform: 'rotate(-2deg)' },
        },
      }}
    />
  );
};

export default WheelPointer;
