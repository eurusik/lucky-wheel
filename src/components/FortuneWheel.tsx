import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { TeamMember } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { useWheelSpin } from '../hooks/useWheelSpin';
import EmptyWheel from './wheel/EmptyWheel';
import WheelToolbar from './wheel/WheelToolbar';
import SettingsDialog from './wheel/SettingsDialog';
import WheelArea from './wheel/WheelArea';
import LegendArea from './wheel/LegendArea';

/**
 * Props for the FortuneWheel component
 */
interface FortuneWheelProps {
  teamMembers: TeamMember[];
  onSpinComplete: () => void;
}

/**
 * Main component for the fortune wheel that combines all wheel parts
 */
interface FortuneWheelProps {
  teamMembers: TeamMember[];
  onSpinComplete: () => void;
  onScreenshot: () => void;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ teamMembers, onSpinComplete, onScreenshot }) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const { innerRadius, outerRadius } = DEFAULT_WHEEL_CONFIG;
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const prevRotationRef = useRef<number>(0);

  const { 
    isSpinning, 
    wheelRotation, 
    spinWheel,
    selectedTeamMember,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorBySVGPointer
  } = useWheelSpin({
    teamMembers,
    onSpinComplete,
  });

  // При зміні ротації оновлюємо ref
  useEffect(() => {
    prevRotationRef.current = wheelRotation;
  }, [wheelRotation]);

  // Оновлюємо секцію під вказівником після зупинки колеса
  useEffect(() => {
    if (!isSpinning && wheelRef.current) {
      setVisibleSectorBySVGPointer(wheelRef.current, outerRadius, wheelRotation);
    }
  }, [isSpinning, outerRadius, wheelRotation, setVisibleSectorBySVGPointer]);

  // Local state for editing team members
  const [members, setMembers] = React.useState<TeamMember[]>(teamMembers);
  useEffect(() => {
    setMembers(teamMembers);
  }, [teamMembers]);

  const handleSaveTeamMembers = (updated: TeamMember[]) => {
    setMembers(updated);
    // If there is a global onSaveTeamMembers, call it here
  };

  if (members.length === 0) {
    return <EmptyWheel />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        m: '40px auto',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
        borderRadius: 8,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.01)',
        p: { xs: 3, md: 5 },
        gap: { xs: 4, md: 7 },
        boxSizing: 'border-box',
        border: '1px solid rgba(230, 235, 255, 0.9)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
          opacity: 0.8,
        }
      }}
    >
      <WheelToolbar 
        onSettingsClick={() => setSettingsDialogOpen(true)}
        onScreenshotClick={onScreenshot}
      />
      <SettingsDialog 
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        teamMembers={members}
        onSave={handleSaveTeamMembers}
      />
      <WheelArea
        wheelRef={wheelRef}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        wheelRotation={wheelRotation}
        isSpinning={isSpinning}
        spinWheel={spinWheel}
        teamMembers={members}
        selectedTeamMember={selectedTeamMember}
        visibleSectorIndex={visibleSectorIndex}
        addImmunityToSelectedSector={addImmunityToSelectedSector}
      />
      <LegendArea />
    </Box>
  );
};

export default FortuneWheel;