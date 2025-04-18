import { Box } from '@mui/material';
import { WheelItem } from '../types';
import FortuneWheel from '../components/wheel/FortuneWheel';
import LegendArea from '../components/wheel/LegendArea';
import WheelLegend from '../components/wheel/WheelLegend';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { BREAKPOINTS, COLORS, SIZES } from '../constants/styleConfig';

interface WheelPageProps {
  items: WheelItem[];
  onSpinComplete: () => void;
  wheelId: string;
}

export const WheelPage = ({ items, onSpinComplete, wheelId }: WheelPageProps) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: SIZES.WHEEL_CONTAINER_PADDING[breakpoint],
      padding: SIZES.WHEEL_CONTAINER_PADDING[breakpoint],
      backgroundColor: COLORS.BACKGROUND,
      minHeight: '100vh',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.WHEEL_CONTAINER_PADDING[breakpoint],
        width: '100%',
        maxWidth: BREAKPOINTS.DESKTOP,
      }}>
        <FortuneWheel 
          items={items} 
          onSpinComplete={onSpinComplete}
          wheelId={wheelId}
        />
        {!isMobile && (
          <LegendArea>
            <WheelLegend wheelId={wheelId} />
          </LegendArea>
        )}
      </Box>
    </Box>
  );
};

export default WheelPage;