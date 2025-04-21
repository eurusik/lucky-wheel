import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

/**
 * Universal input component for Lucky Wheel, styled as a classic outlined input.
 * Wraps MUI's TextField with default variant 'outlined' and allows all standard props.
 */
const Input: React.FC<TextFieldProps> = ({ variant = 'outlined', ...props }) => {
  return <TextField variant={variant} {...props} />;
};

export default React.memo(Input);
