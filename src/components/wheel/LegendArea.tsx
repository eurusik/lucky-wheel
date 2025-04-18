import React from 'react';
import { Box } from '@mui/material';

interface LegendAreaProps {
  children: React.ReactNode;
}

const LegendArea: React.FC<LegendAreaProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      {children}
    </Box>
  );
};

export default LegendArea;
