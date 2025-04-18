import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/styleConfig';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const WheelNotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: COLORS.BACKGROUND,
        padding: { xs: 2, sm: 3, md: 4 },
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: { xs: 64, sm: 80, md: 96 },
          color: 'primary.main',
          marginBottom: 3,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          marginBottom: 2,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
        }}
      >
        Wheel Not Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: 450,
          marginBottom: 4,
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
        }}
      >
        The wheel you're looking for doesn't exist or has been removed.
        Would you like to create a new one?
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          fontWeight: 600,
          padding: '12px 32px',
          borderRadius: 2,
          textTransform: 'none',
          fontSize: { xs: '1rem', sm: '1.1rem' },
        }}
      >
        Create New Wheel
      </Button>
    </Box>
  );
};

export default WheelNotFoundPage; 