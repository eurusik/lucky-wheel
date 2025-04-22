import React from 'react';
import Button from './Button';
import PublicIcon from '@mui/icons-material/Public';
import { Link } from 'react-router-dom';

const WheelBrowserButton: React.FC = () => {
  return (
    <Link to="/wheels-browser" style={{ textDecoration: 'none' }}>
      <Button
      sx={{
        position: 'fixed',
        top: 24,
        right: 32,
        zIndex: 1200,
        px: 2.5,
        py: 1.2,
        fontSize: 16,
      }}

    > 
      <PublicIcon sx={{ mr: 1, fontSize: 22 }} />
      Browse Wheels
    </Button>
    </Link>
  );
};

export default WheelBrowserButton;
