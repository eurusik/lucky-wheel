import { memo } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { TeamMember, SpinStats } from '../types';
import FortuneWheel from '../components/FortuneWheel';

interface WheelPageProps {
  teamMembers: TeamMember[];
  spinStats: SpinStats;
  onSpinComplete: () => void;
  onScreenshot: () => void;
  onSettingsClick: () => void;
}

const SpinStatistics = memo(({ stats }: { stats: SpinStats }) => (
  <Fade in={true} timeout={800}>
    <Box
      sx={{
        position: 'absolute',
        bottom: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}
      >
        Spins: {stats.count} / Last spin: {stats.lastSpinTime}
      </Typography>
    </Box>
  </Fade>
));

SpinStatistics.displayName = 'SpinStatistics';

const WheelPage = ({ 
  teamMembers, 
  spinStats, 
  onSpinComplete, 
  onScreenshot,
  onSettingsClick 
}: WheelPageProps) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <FortuneWheel 
        teamMembers={teamMembers} 
        onSpinComplete={onSpinComplete} 
        onScreenshot={onScreenshot} 
      />
      {spinStats.count > 0 && (
        <SpinStatistics stats={spinStats} />
      )}
    </Box>
  );
};

export default memo(WheelPage);