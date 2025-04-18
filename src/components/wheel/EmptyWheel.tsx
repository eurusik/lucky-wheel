import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Placeholder component shown when there are no team members to display
 */
const EmptyWheel: React.FC = () => {
  return (
    <Box
      sx={{
        width: 400,
        height: 400,
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
