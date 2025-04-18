import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CreateWheelDialog } from '../components/wheel/CreateWheelDialog';
import { AccessHashDialog } from '../components/wheel/AccessHashDialog';
import { CreateWheelResponse } from '../types';

export const HomePage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [newWheelData, setNewWheelData] = useState<CreateWheelResponse | null>(null);

  const handleWheelCreated = (response: CreateWheelResponse) => {
    setNewWheelData(response);
    setCreateDialogOpen(false);
    setAccessDialogOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Lucky Wheel
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 600, mb: 2 }}
        >
          Create your own customizable wheel for random selection,
          team building, decision making, and more!
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            py: 2,
            px: 4,
            borderRadius: 2,
            fontSize: '1.1rem',
          }}
        >
          Create New Wheel
        </Button>

        <CreateWheelDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onWheelCreated={handleWheelCreated}
        />

        {newWheelData && (
          <AccessHashDialog
            open={accessDialogOpen}
            onClose={() => setAccessDialogOpen(false)}
            wheelData={newWheelData}
          />
        )}
      </Box>
    </Container>
  );
}; 