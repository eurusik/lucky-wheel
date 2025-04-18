import React from 'react';
import { Box, IconButton } from '@mui/material';
import { iconButtonSx } from '../../styles/common';
import SettingsIcon from '@mui/icons-material/Settings';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface WheelToolbarProps {
  onSettingsClick: () => void;
  onScreenshotClick: () => void;
}

/**
 * Toolbar for the wheel page, containing settings and screenshot buttons.
 */
const WheelToolbar: React.FC<WheelToolbarProps> = ({ onSettingsClick, onScreenshotClick }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 16,
      right: 24,
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      zIndex: 10,
      background: 'rgba(255,255,255,0.93)',
      borderRadius: '24px',
      boxShadow: '0 2px 12px rgba(60, 80, 180, 0.10)',
      px: 2,
      py: 0.5,
      alignItems: 'center',
    }}
  >
    <IconButton
      aria-label="Settings"
      title="Settings"
      onClick={onSettingsClick}
      sx={iconButtonSx}
    >
      <SettingsIcon fontSize="medium" />
    </IconButton>
    <IconButton
      aria-label="Screenshot"
      title="Screenshot"
      onClick={onScreenshotClick}
      sx={iconButtonSx}
    >
      <CameraAltIcon fontSize="medium" />
    </IconButton>
  </Box>
);

export default WheelToolbar;
