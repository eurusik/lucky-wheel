import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Box from '@mui/material/Box';
import Button from './Button';
import Input from './Input';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { COLORS } from '../../constants/styleConfig';

interface RenameWheelModalProps {
  open: boolean;
  initialName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

/**
 * Modal dialog for renaming a wheel
 */
const modalBoxStyle = {
  borderRadius: 16,
  padding: '36px 20px 22px 20px',
  minWidth: 340,
  background: COLORS.BACKGROUND,
  boxShadow: COLORS.WHEEL_SHADOW,
  textAlign: 'center' as const,
  position: 'relative' as const,
};

const titleStyle = {
  fontWeight: 800,
  fontSize: 24,
  color: COLORS.TEXT,
  letterSpacing: 0.5,
  mb: 2,
  fontFamily: 'inherit',
};

const inputBoxStyle = {
  mt: 2,
  mb: 1.5,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  gap: 1,
};

const RenameWheelModal: React.FC<RenameWheelModalProps> = ({ open, initialName, onSave, onClose }) => {
  const [name, setName] = useState(initialName);

  React.useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: modalBoxStyle }}>
      <Fade in={open} timeout={400}>
        <Box>
          <Grow in={open} timeout={600}>
            <Box>
              <DialogTitle sx={titleStyle}>Rename Wheel</DialogTitle>
              <DialogContent sx={inputBoxStyle}>
                <Input
                  autoFocus
                  label="New name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  inputProps={{ maxLength: 40 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '0.97rem',
                      background: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffd54f',
                      borderWidth: 2,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffe082',
                    },
                    mt: 0.5,
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center', gap: 2, mt: 1.5 }}>
                <Button onClick={onClose} color="secondary" variant="outlined" sx={{ borderRadius: 99, px: 3, fontWeight: 700, fontSize: 16, boxShadow: 'none' }}>
                  <CloseIcon sx={{ fontSize: 20, mr: 1 }} />
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (name.trim()) onSave(name.trim());
                  }}
                  color="primary"
                  variant="contained"
                  sx={{ borderRadius: 99, px: 3, fontWeight: 700, fontSize: 16, boxShadow: 'none' }}
                  disabled={!name.trim()}
                >
                  <SaveIcon sx={{ fontSize: 20, mr: 1 }} />
                  Save
                </Button>
              </DialogActions>
            </Box>
          </Grow>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default RenameWheelModal;
