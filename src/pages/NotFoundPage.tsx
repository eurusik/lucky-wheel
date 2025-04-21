import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f6fa',
        p: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 68, sm: 92 },
          fontWeight: 900,
          color: '#ffd54f',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)',
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#212121',
          mb: 2,
        }}
      >
        Oops! Wheel not found
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: '#757575', mb: 4, textAlign: 'center', maxWidth: 380 }}
      >
        The page you are looking for does not exist or the wheel ID is invalid. Try creating a new wheel or check the link.
      </Typography>
      <Button
        variant="contained"
        sx={{
          background: '#ffd54f',
          color: '#664d00',
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 12,
          px: 4,
          py: 1.5,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          '&:hover': {
            background: '#ffecb3',
          },
        }}
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
