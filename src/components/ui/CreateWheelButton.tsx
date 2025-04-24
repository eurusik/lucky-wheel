import React from 'react';
import Button from './Button';

interface CreateWheelButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const CreateWheelButton: React.FC<CreateWheelButtonProps> = ({ 
  type = 'button',
  onClick 
}) => {
  return (
    <Button 
      type={type} 
      onClick={onClick}
      sx={{ 
        fontSize: 20, 
        padding: '12px 32px',
        width: { xs: '100%', sm: 'auto' }
      }}
    >
      Create Wheel
    </Button>
  );
};

export default CreateWheelButton;
