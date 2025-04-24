import React from 'react';
import Button from './Button';

interface CreateWheelButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

const CreateWheelButton: React.FC<CreateWheelButtonProps> = ({ 
  type = 'button',
  onClick,
  disabled = false
}) => {
  return (
    <Button 
      type={type} 
      onClick={onClick}
      disabled={disabled}
      sx={{ 
        fontSize: 20, 
        padding: '12px 32px',
        width: { xs: '100%', sm: 'auto' },
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      Create Wheel
    </Button>
  );
};

export default CreateWheelButton;
