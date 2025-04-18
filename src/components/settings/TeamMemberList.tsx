import React from 'react';
import { Box, List } from '@mui/material';
import { TeamMember } from '../../types';
import TeamMemberItem from './TeamMemberItem';
import { SETTINGS } from '../../constants/styleConfig';

/**
 * Props for the TeamMemberList component
 */
interface TeamMemberListProps {
  members: TeamMember[];
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Component for displaying and managing the list of team members
 */
const TeamMemberList: React.FC<TeamMemberListProps> = ({
  members,
  onNameChange,
  onRemove
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: SETTINGS.SPACING.CONTENT_PADDING,
      }}
    >
      <List>
        {members.map((member) => (
          <TeamMemberItem
            key={member.id}
            member={member}
            onNameChange={onNameChange}
            onRemove={onRemove}
          />
        ))}
      </List>
    </Box>
  );
};

export default TeamMemberList;
