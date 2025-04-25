import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { SIZES } from '../../constants/styleConfig';
import AddIcon from '@mui/icons-material/Add';
import { iconButtonSx } from '../../styles/common';

interface EmptyWheelProps {
  onOpenSettings?: () => void;
}

/**
 * Placeholder component shown when there are no team members to display
 */
const EmptyWheel: React.FC<EmptyWheelProps> = ({ onOpenSettings }) => {
  return (
    <Box
      sx={{
        width: { xs: SIZES.WHEEL_SIZE.mobile, sm: SIZES.WHEEL_SIZE.tablet, md: SIZES.WHEEL_SIZE.desktop },
        height: { xs: SIZES.WHEEL_SIZE.mobile, sm: SIZES.WHEEL_SIZE.tablet, md: SIZES.WHEEL_SIZE.desktop },
        borderRadius: '50%',
        border: '2px dashed #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        marginTop: '25px'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h6" color="text.secondary">
          No team members added yet
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <IconButton
            aria-label="Settings"
            title="Settings"
            onClick={onOpenSettings}
            sx={{
              ...iconButtonSx,
              width: 48,
              height: 48,
              backgroundColor: '#FFD700',
              color: '#333',
              '&:hover': {
                backgroundColor: '#FFC000',
                transform: 'scale(1.09)',
                boxShadow: '0 2px 8px rgba(180, 160, 60, 0.25)',
              },
            }}
          >
            <AddIcon fontSize="medium" />
          </IconButton>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add team members
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmptyWheel;
