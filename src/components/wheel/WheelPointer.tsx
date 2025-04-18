import React from 'react';
import { Box } from '@mui/material';
import { COLORS, SIZES } from '../../constants/styleConfig';

/**
 * Pointer component that indicates the winning sector on the wheel
 */
const WheelPointer: React.FC = () => {
  return (
    <Box
      id="wheel-pointer"
      data-testid="wheel-pointer"
      sx={{
        position: 'absolute',
        top: -5,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${SIZES.POINTER_WIDTH}px`,
        height: `${SIZES.POINTER_HEIGHT}px`,
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
          animation: 'wiggle 0.5s infinite linear',
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
