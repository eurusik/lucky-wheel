import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { TeamMember } from '../types';
import { generateRandomColor } from '../constants/wheelConfig';
import { SETTINGS } from '../constants/styleConfig';
import ItemList from '../components/settings/ItemList';
import ActionButtons from '../components/settings/ActionButtons';

/**
 * Props for the SettingsPage component
 */
interface SettingsPageProps {
  teamMembers: TeamMember[];
  onSave: (members: TeamMember[]) => void;
}

/**
 * Page component for managing team members
 */
const SettingsPage: React.FC<SettingsPageProps> = ({ teamMembers, onSave }) => {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      color: generateRandomColor(),
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const handleNameChange = (id: string, newName: string) => {
    setMembers(
      members.map(member =>
        member.id === id ? { ...member, name: newName } : member
      )
    );
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: SETTINGS.MAX_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: SETTINGS.SPACING.PAGE_PADDING,
          overflow: 'hidden',
        }}
      >
        <Paper
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <ItemList 
            members={members}
            onNameChange={handleNameChange}
            onRemove={handleRemoveMember}
          />

          <ActionButtons 
            members={members}
            onAddMember={handleAddMember}
            onSave={onSave}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage; 