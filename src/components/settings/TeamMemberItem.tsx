import React from 'react';
import { Box, TextField, IconButton, ListItem } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { TeamMember } from '../../types';
import { SETTINGS } from '../../constants/styleConfig';

/**
 * Props for the TeamMemberItem component
 */
interface TeamMemberItemProps {
  member: TeamMember;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Component for displaying and editing a single team member
 */
const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  onNameChange,
  onRemove
}) => {
  return (
    <ListItem
      sx={{
        gap: SETTINGS.SPACING.ITEM_GAP,
        mb: SETTINGS.SPACING.ITEM_MARGIN,
      }}
    >
      <TextField
        fullWidth
        value={member.name}
        onChange={(e) => onNameChange(member.id, e.target.value)}
        placeholder="Enter team member name"
        size="small"
      />
      <Box
        sx={{
          width: SETTINGS.COLOR_SWATCH_SIZE,
          height: SETTINGS.COLOR_SWATCH_SIZE,
          borderRadius: SETTINGS.BORDER_RADIUS,
          bgcolor: member.color,
        }}
      />
      <IconButton
        onClick={() => onRemove(member.id)}
        color="error"
        size="small"
        aria-label="Remove team member"
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(TeamMemberItem);
