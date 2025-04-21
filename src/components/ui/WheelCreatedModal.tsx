import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box, Fade, Tooltip, Grow } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Button from './Button';
import { COLORS, BUTTONS } from '../../constants/styleConfig';

interface WheelCreatedModalProps {
  open: boolean;
  onClose: () => void;
  wheelName: string;
  wheelId: string;
}

const modalBoxStyle = {
  borderRadius: 16,
  padding: '32px 20px 20px 20px',
  minWidth: 340,
  background: '#f5f6fa',
  boxShadow: COLORS.WHEEL_SHADOW,
  textAlign: 'center' as const,
  position: 'relative' as const,
};

const labelStyle = {
  fontWeight: 700,
  color: COLORS.TEXT_SECONDARY,
  fontSize: 16,
  marginBottom: 4,
  letterSpacing: 0.2,
};

const valueStyle = {
  fontWeight: 700,
  color: COLORS.TEXT,
  fontSize: 19,
  wordBreak: 'break-all' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#fff',
  borderRadius: 10,
  padding: '8px 16px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
};

const WheelCreatedModal: React.FC<WheelCreatedModalProps> = ({ open, onClose, wheelName, wheelId }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wheelId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: modalBoxStyle }}>
      <Fade in={open} timeout={400}>
        <Box>
          <Grow in={open} timeout={600}>
            <CheckCircleRoundedIcon sx={{ color: '#4caf50', fontSize: 64, mb: 1, mt: 3 }} />
          </Grow>
          <DialogTitle sx={{ fontWeight: 700, fontSize: 26, color: COLORS.TEXT, mb: 1, mt: 0 }}>Wheel Created</DialogTitle>
          <DialogContent sx={{ pb: 0 }}>
            <Box mb={3}>
              <Typography sx={labelStyle}>Wheel Name</Typography>
              <Typography sx={valueStyle}>{wheelName}</Typography>
            </Box>
            <Box mb={3}>
              <Typography sx={labelStyle}>Wheel ID</Typography>
              <Box sx={valueStyle}>
                {wheelId}
                <Tooltip title={copied ? 'Copied!' : 'Copy ID'} arrow>
                  <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }} aria-label="Copy ID">
                    <ContentCopyIcon fontSize="small" color={copied ? 'success' : 'inherit'} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 1 }}>
            <Button onClick={onClose} sx={{ ...BUTTONS, minWidth: 130, fontSize: 18, borderRadius: 2, boxShadow: '0 2px 12px #ffd54f50' }}>OK</Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default WheelCreatedModal;
