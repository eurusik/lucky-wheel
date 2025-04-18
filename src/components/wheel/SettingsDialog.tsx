import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TeamMemberList from '../settings/TeamMemberList';
import ActionButtons from '../settings/ActionButtons';
import { TeamMember } from '../../types';
import { generateRandomColor } from '../../constants/wheelConfig';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  onSave: (members: TeamMember[]) => void;
}

import { Paper } from '@mui/material';
import { SETTINGS } from '../../constants/styleConfig';

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, teamMembers, onSave }) => {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);

  // Update local state if teamMembers change externally
  useEffect(() => {
    setMembers(teamMembers);
  }, [teamMembers]);

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

  const handleSave = () => {
    onSave(members); // Save changes globally
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Налаштування
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
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
          <TeamMemberList
            members={members}
            onNameChange={handleNameChange}
            onRemove={handleRemoveMember}
          />
          <ActionButtons
            members={members}
            onAddMember={handleAddMember}
            onSave={handleSave}
          />
        </Paper>
      </Box>
    </Drawer>
  );
};

export default SettingsDialog;
