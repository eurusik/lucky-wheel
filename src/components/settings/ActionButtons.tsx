import React from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TeamMember } from '../../types';
import { SETTINGS } from '../../constants/styleConfig';

/**
 * Props for the ActionButtons component
 */
interface ActionButtonsProps {
  members: TeamMember[];
  onAddMember: () => void;
  onSave: (members: TeamMember[]) => void;
}

/**
 * Component for action buttons in the settings page
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  members,
  onAddMember,
  onSave
}) => {
  // Check if any team member has an empty name
  const hasEmptyNames = members.some(member => !member.name.trim());
  
  return (
    <Box
      sx={{
        p: SETTINGS.SPACING.CONTENT_PADDING,
        pt: SETTINGS.SPACING.ACTIONS_PADDING,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: SETTINGS.SPACING.ITEM_GAP,
      }}
    >
      <Button
        startIcon={<AddIcon />}
        onClick={onAddMember}
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
        aria-label="Add team member"
      >
        Add Member
      </Button>

      <Button
        onClick={() => onSave(members)}
        variant="contained"
        disabled={hasEmptyNames}
        fullWidth
        aria-label="Save changes"
      >
        Save Changes
      </Button>
    </Box>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ActionButtons);
