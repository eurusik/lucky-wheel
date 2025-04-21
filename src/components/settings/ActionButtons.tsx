import React from 'react';
import { Box, Stack } from '@mui/material';
import Button from '../ui/Button';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { WheelItem } from '../../types';
import { SETTINGS, STACK_GAP } from '../../constants/styleConfig';

/**
 * Props for the ActionButtons component
 */
interface ActionButtonsProps {
  items: WheelItem[];
  onAddItem: () => void;
  onSave: (items: WheelItem[]) => void;
}

/**
 * Component for action buttons in the settings page
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ items = [], onAddItem, onSave }) => {
  // Check if any item has an empty name
  const hasEmptyNames = Array.isArray(items) && items.some(item => !item?.name?.trim());
  
  return (
    <Box
      sx={{
        p: SETTINGS.SPACING.CONTENT_PADDING,
        pt: SETTINGS.SPACING.ACTIONS_PADDING,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ 
          width: '100%',
          maxWidth: '500px',
          m: 0.5,
          gap: STACK_GAP
        }}
      >
        <Button
          variant="outlined"
          onClick={onAddItem}
          startIcon={<AddIcon />}

          tooltip="Add participant"
        >
          Add Item
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(items || [])}
          disabled={hasEmptyNames}
          startIcon={<SaveIcon />}

          tooltip={hasEmptyNames ? 'Fill in all names' : 'Save changes'}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default React.memo(ActionButtons);
