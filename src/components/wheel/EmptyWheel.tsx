import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

interface EmptyWheelProps {
  onSettingsClick?: () => void;
}

/**
 * Placeholder component shown when there are no team members to display
 */
const EmptyWheel: React.FC<EmptyWheelProps> = ({ onSettingsClick }) => {
  return (
    <Box
      sx={{
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '2px dashed #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        gap: 2
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Add team members in settings to start spinning the wheel
      </Typography>
      {onSettingsClick && (
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={onSettingsClick}
          sx={{ mt: 2 }}
        >
          Open Settings
        </Button>
      )}
    </Box>
  );
};

export default EmptyWheel;
