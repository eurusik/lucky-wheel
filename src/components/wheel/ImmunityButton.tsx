import React from 'react';
import Button from '../ui/Button';
import ShieldIcon from '@mui/icons-material/Shield';

interface ImmunityButtonProps {
  onClick: () => void;
  selectedSectorName: string | null;
}

/**
 * Button to add immunity to the selected sector. Disabled if no sector is selected or not visible.
 */
const ImmunityButton: React.FC<ImmunityButtonProps> = ({ 
  onClick, 
  selectedSectorName 
}) => {
  const disabled =!selectedSectorName;

  return (
    <Button
      variant="contained"
      startIcon={<ShieldIcon />}
      onClick={onClick}
      disabled={disabled}
      tooltip={selectedSectorName ? `Add immunity for sector "${selectedSectorName}" (🛡️)` : "No sector selected"}

    >
      Add Immunity
    </Button>
  );
};

export default React.memo(ImmunityButton);
