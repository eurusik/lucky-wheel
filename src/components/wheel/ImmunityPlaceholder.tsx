import React from 'react';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';

/**
 * Placeholder shown when there are no immunities.
 */
const ImmunityPlaceholder: React.FC = () => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      mt: 3,
      mb: 3,
      border: '2px dashed #ffe082',
      borderRadius: 3,
      background: '#fffbe9',
      px: { xs: 2, sm: 3 },
      py: 2,
      boxSizing: 'border-box',
    }}
  >
    <Box sx={{ fontSize: { xs: 32, sm: 38 }, color: '#ffe082', mb: 1 }}>
      <InfoOutlinedIcon fontSize="inherit" />
    </Box>
    <Typography sx={{ 
      color: '#bfa100', 
      fontWeight: 500, 
      fontSize: { xs: '0.95rem', sm: '0.98rem' }, 
      mb: 0.5,
      textAlign: 'center',
      maxWidth: '100%'
    }}>
      No immunities yet
    </Typography>
    <Typography sx={{ 
      color: '#bfa100', 
      fontSize: { xs: '0.85rem', sm: '0.89rem' }, 
      opacity: 0.8,
      textAlign: 'center',
      maxWidth: '100%',
      px: { xs: 1, sm: 0 }
    }}>
      When you add an immunity, it will appear here as a chip.
    </Typography>
  </Box>
);

export default ImmunityPlaceholder;
