import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { wheelService } from '../../services/wheelService';
import { CreateWheelResponse } from '../../types';

interface CreateWheelDialogProps {
  open: boolean;
  onClose: () => void;
  onWheelCreated: (response: CreateWheelResponse) => void;
}

export const CreateWheelDialog: React.FC<CreateWheelDialogProps> = ({
  open,
  onClose,
  onWheelCreated,
}) => {
  const [wheelName, setWheelName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!wheelName.trim()) {
      setError('Please enter a wheel name');
      return;
    }

    try {
      const response = wheelService.createWheel(wheelName.trim());
      onWheelCreated(response);
      onClose();
    } catch (err) {
      setError('Failed to create wheel. Please try again.');
    }
  };

  const handleClose = () => {
    setWheelName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Create New Wheel
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            label="Wheel Name"
            fullWidth
            value={wheelName}
            onChange={(e) => setWheelName(e.target.value)}
            placeholder="Enter a name for your wheel"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            After creating the wheel, you'll receive a unique access hash.
            Make sure to save it - you'll need it to manage your wheel later.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={!wheelName.trim()}
        >
          Create Wheel
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 