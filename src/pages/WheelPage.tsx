import { Box, Typography } from '@mui/material';
import { TeamMember, SpinStats } from '../types';
import FortuneWheel from '../components/FortuneWheel';

interface WheelPageProps {
  teamMembers: TeamMember[];
  spinStats: SpinStats;
  onSpinComplete: () => void;
  onScreenshot: () => void;
  onSettingsClick: () => void;
}

const WheelPage = ({ teamMembers, spinStats, onSpinComplete, onScreenshot }: WheelPageProps) => {
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
      <FortuneWheel teamMembers={teamMembers} onSpinComplete={onSpinComplete} onScreenshot={onScreenshot} />
      {spinStats.count > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Spins: {spinStats.count} / Last spin: {spinStats.lastSpinTime}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WheelPage;