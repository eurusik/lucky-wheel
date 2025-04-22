import React from 'react';
import { Box, Typography } from '@mui/material';
import { COLORS } from '../../constants/styleConfig';

interface LoaderProps {
  label?: string;
  container?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ label, container }) => (
  <Box
    sx={container ? {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 260,
      py: 7,
      background: COLORS.WHEEL_CONTAINER_BG,
      borderRadius: 4,
      boxShadow: COLORS.WHEEL_SHADOW,
      border: `2.5px dashed ${COLORS.POINTER}`,
      position: 'relative',
      mt: 4,
      mb: 4,
      fontFamily: 'inherit',
    } : {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: COLORS.BACKGROUND,
      fontFamily: 'inherit',
      zIndex: 2000,
      overflow: 'hidden',
    }}
  >
    <span style={{ fontSize: 54, marginBottom: 12, filter: 'drop-shadow(0 2px 8px #e91e6344)' }} role="img" aria-label="wheel spinner">🎡</span>
    <Typography
      sx={{
        mt: 1,
        color: COLORS.TEXT,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 0.5,
        textAlign: 'center',
        fontFamily: 'inherit',
      }}
    >
      {label || 'Loading...'}
    </Typography>
    <Typography
      sx={{
        mt: 2,
        color: COLORS.TEXT_SECONDARY,
        fontSize: 15,
        fontWeight: 400,
        textAlign: 'center',
        opacity: 0.7,
      }}
    >
      Please wait while we prepare your lucky wheel!
    </Typography>
  </Box>
);

export default Loader;
