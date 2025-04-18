import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { TeamMember } from '../../types';
import { SETTINGS } from '../../constants/styleConfig';
import { COLORS } from '../../constants/styleConfig';

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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={4}
        sx={{ 
          width: '100%',
          maxWidth: '500px',
          m: 0.5
        }}
      >
        <Button
          variant="outlined"
          onClick={onAddMember}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '24px',
            borderColor: 'rgba(255, 213, 79, 0.5)',
            color: '#000000',
            px: 3,
            py: 1,
            m: 0.5,
            fontSize: '0.95rem',
            fontWeight: 500,
            backgroundColor: 'rgba(255, 213, 79, 0.04)',
            textTransform: 'none',
            minWidth: '160px',
            '&:hover': {
              borderColor: 'rgba(255, 213, 79, 0.8)',
              backgroundColor: 'rgba(255, 213, 79, 0.08)',
              boxShadow: '0 2px 8px rgba(255, 213, 79, 0.15)'
            }
          }}
        >
          Add Member
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(members)}
          disabled={hasEmptyNames}
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: '24px',
            py: 1.2,
            px: 4,
            m: 0.5,
            fontSize: '0.95rem',
            fontWeight: 500,
            backgroundColor: COLORS.STAR_BACKGROUND,
            color: '#000000',
            textTransform: 'none',
            minWidth: '160px',
            boxShadow: '0 2px 6px rgba(255, 213, 79, 0.25)',
            '&:hover': {
              backgroundColor: COLORS.STAR_BACKGROUND_HOVER,
              boxShadow: '0 4px 12px rgba(255, 213, 79, 0.3)'
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 213, 79, 0.5)',
              color: 'rgba(0, 0, 0, 0.38)'
            }
          }}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ActionButtons);
