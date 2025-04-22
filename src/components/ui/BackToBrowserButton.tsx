import React from 'react';
import Button from './Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackToBrowserButton: React.FC<{ sx?: any }> = ({ sx }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/wheels-browser')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: { xs: 2, sm: 3 },
        fontSize: { xs: 15, sm: 16 },
        px: { xs: 1.6, sm: 2.5 },
        py: { xs: 0.7, sm: 1 },
        borderRadius: 99,
        ...sx
      }}
      variant="outlined"
      color="primary"
    >
      <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
      Back to Wheel Browser
    </Button>
  );
};

export default BackToBrowserButton;
