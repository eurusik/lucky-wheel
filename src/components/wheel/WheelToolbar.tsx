import React from 'react';
import { Box, IconButton } from '@mui/material';
import { iconButtonSx } from '../../styles/common';
import SettingsIcon from '@mui/icons-material/Settings';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ShareIcon from '@mui/icons-material/Share';

interface WheelToolbarProps {
  onSettingsClick: () => void;
  onScreenshotClick: () => void;
  onShareClick: () => void;
}

/**
 * Toolbar for the wheel page, containing settings, screenshot, and share buttons.
 */
const WheelToolbar: React.FC<WheelToolbarProps> = ({ onSettingsClick, onScreenshotClick, onShareClick }) => (
  <Box
    sx={{
      position: { xs: 'static', sm: 'static', md: 'absolute' },
      top: { md: 16 },
      right: { md: 24 },
      left: { xs: 0, sm: 0, md: 'auto' },
      display: 'flex',
      flexDirection: 'row',
      gap: { xs: 1, sm: 1.5, md: 2 },
      zIndex: 10,
      background: 'rgba(255,255,255,0.93)',
      borderRadius: { xs: '16px', sm: '18px', md: '24px' },
      boxShadow: '0 2px 12px rgba(60, 80, 180, 0.10)',
      px: { xs: 1, sm: 1.5, md: 2 },
      py: { xs: 0.5, sm: 0.7, md: 0.5 },
      alignItems: 'center',
      width: { xs: 'fit-content', sm: 'fit-content', md: 'auto' },
      mx: { xs: 'auto', sm: 'auto', md: 0 },
      mt: { xs: 1, sm: 1.5, md: 0 },
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
    <IconButton
      aria-label="Share"
      title="Share"
      onClick={onShareClick}
      sx={iconButtonSx}
    >
      <ShareIcon fontSize="medium" />
    </IconButton>
  </Box>
);

export default WheelToolbar;
