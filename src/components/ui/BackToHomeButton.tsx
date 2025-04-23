import React from 'react';
import Button from './Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/system';

const BackToHomeButton: React.FC<{ sx?: SxProps<Theme>, onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void }> = ({ sx, onClick }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        navigate('/');
      }}
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
      Back to Home
    </Button>
  );
};

export default BackToHomeButton;
