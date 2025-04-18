import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CreateWheelResponse } from '../../types';

interface AccessHashDialogProps {
  open: boolean;
  onClose: () => void;
  wheelData: CreateWheelResponse;
}

export const AccessHashDialog: React.FC<AccessHashDialogProps> = ({
  open,
  onClose,
  wheelData,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wheelData.accessHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const wheelUrl = `${window.location.origin}/wheel/${wheelData.wheel.id}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Wheel Created Successfully!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please save this information. You'll need the access hash to manage your wheel later.
          </Alert>
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Wheel URL:
          </Typography>
          <TextField
            fullWidth
            value={wheelUrl}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title="Copy URL">
                  <IconButton onClick={() => navigator.clipboard.writeText(wheelUrl)} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Access Hash:
          </Typography>
          <TextField
            fullWidth
            value={wheelData.accessHash}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title={copied ? 'Copied!' : 'Copy Hash'}>
                  <IconButton onClick={handleCopy} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Share the URL with others to let them use your wheel.
            Keep the access hash private - you'll need it to modify the wheel later.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 