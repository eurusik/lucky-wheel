// Common reusable style objects for MUI components

export const iconButtonSx = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#f0f4ff',
    transform: 'scale(1.09)',
    boxShadow: '0 2px 8px rgba(60, 80, 180, 0.13)',
  },
};
