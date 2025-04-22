import React from 'react';
import Button from './Button';
import PublicIcon from '@mui/icons-material/Public';
import { Link } from 'react-router-dom';

const WheelBrowserButton: React.FC = () => {
  return (
    <Link to="/wheels-browser" style={{ textDecoration: 'none' }}>
      <Button
        sx={{
          position: { xs: 'static', sm: 'static', md: 'fixed' },
          top: { md: 24 },
          right: { md: 32 },
          zIndex: 1200,
          px: 2.5,
          py: 1.2,
          fontSize: 16,
          width: { xs: '100%', sm: '100%', md: 'auto' },
          maxWidth: 360,
          margin: { xs: '0 0 16px 0', md: 0 },
        }}
      > 
      <PublicIcon sx={{ mr: 1, fontSize: 22 }} />
      Browse Wheels
    </Button>
    </Link>
  );
};

export default WheelBrowserButton;
