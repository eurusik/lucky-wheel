import React from 'react';
import Button from './Button';
import PublicIcon from '@mui/icons-material/Public';
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery, Box } from '@mui/material';

const WheelBrowserButton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{
      width: '100%',
      display: 'block',
    }}>
      <Link to="/wheels-browser" style={{ textDecoration: 'none', display: 'block' }}>
        <Button
          sx={{
            backgroundColor: '#ffd54f',
            color: '#212121',
            fontSize: isMobile ? '0.9rem' : '1rem',
            padding: isMobile ? '12px' : '10px 20px',
            width: isMobile ? 'auto' : '100%',
            minWidth: isMobile ? '48px' : '120px',
            maxWidth: isMobile ? '48px' : 'none',
            borderRadius: isMobile ? '50%' : '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '48px' : 'auto',
            aspectRatio: isMobile ? '1/1' : 'auto',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#ffca28',
              boxShadow: '0 4px 12px rgba(255, 213, 79, 0.2)'
            },
            '&:active': {
              transform: isMobile ? 'scale(0.98)' : 'none',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
            }
          }}
          aria-label="Browse Wheels"
        > 
          <PublicIcon sx={{ 
            fontSize: isMobile ? '1.5rem' : '1.4rem',
            verticalAlign: 'middle',
            marginRight: isMobile ? 0 : 1
          }} />
          {!isMobile && 'Browse Wheels'}
        </Button>
      </Link>
    </Box>
  );
};

export default WheelBrowserButton;
