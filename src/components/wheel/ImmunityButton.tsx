import React from 'react';
import { Button, Tooltip } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

interface ImmunityButtonProps {
  isVisible: boolean;
  onClick: () => void;
  selectedSectorName: string | null;
}

/**
 * Button to add immunity to the selected sector. Disabled if no sector is selected or not visible.
 */
const ImmunityButton: React.FC<ImmunityButtonProps> = ({ 
  isVisible, 
  onClick, 
  selectedSectorName 
}) => {
  const disabled = !isVisible || !selectedSectorName;

  return (
    <Tooltip title={selectedSectorName ? `Add immunity for sector "${selectedSectorName}" (🛡️)` : "No sector selected"}>
      <span>
        <Button
          variant="contained"
          startIcon={<ShieldIcon />}
          onClick={onClick}
          disabled={disabled}
          sx={{
            mt: 3,
            mb: 4,
            px: 5,
            py: 2.3,
            fontSize: '1.22rem',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #ffe082 0%, #ffd54f 100%)',
            color: '#7a5600',
            fontWeight: 700,
            textShadow: '0 1px 2px #fff8e1',
            boxShadow: '0 6px 24px 0 rgba(255, 215, 64, 0.23)',
            letterSpacing: 0.4,
            transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #ffd54f 0%, #ffe082 100%)',
              color: '#ffb300',
              boxShadow: '0 8px 32px 0 rgba(255, 215, 64, 0.32)',
            },
          }}
        >
          Add Immunity
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.memo(ImmunityButton);
