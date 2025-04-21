import { memo } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { SpinStats, WheelItem } from '../types';
import FortuneWheel from '../components/FortuneWheel';

interface WheelPageProps {
  id?: string;
  items: WheelItem[];
  spinStats: SpinStats;
  onSpinComplete: () => void;
  onItemsChange?: (items: WheelItem[]) => void;
}

const SpinStatistics = memo(({ stats }: { stats: SpinStats }) => (
  <Fade in={true} timeout={800}>
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: { xs: 2, sm: 3, md: 4 }
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
  id,
  items, 
  spinStats, 
  onSpinComplete, 
  onItemsChange
}: WheelPageProps) => {
  return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
          <FortuneWheel
              id={id}
              items={items}
              onSpinComplete={onSpinComplete}
              onItemsChange={onItemsChange}
          />
          {spinStats.count > 0 && (
              <SpinStatistics stats={spinStats} />
          )}
      </div>
  );
};

export default memo(WheelPage);