import React from 'react';
import { Box } from '@mui/material';


const HomeLogo: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      mb: 2.5,
      userSelect: 'none',
    }}
    aria-label="Lucky Wheel Logo"
  >
    <span style={{ fontSize: 84, filter: 'drop-shadow(0 2px 12px #e91e6344)' }}>🎡</span>
  </Box>
);

export default HomeLogo;
