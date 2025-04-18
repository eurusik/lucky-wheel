import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { WheelItem } from '../../types';
import { useWheelSpin } from '../../hooks/useWheelSpin';
import WheelArea from './WheelArea';
import WheelToolbar from './WheelToolbar';
import ImmunityButton from './ImmunityButton';
import { SIZES } from '../../constants/styleConfig';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface FortuneWheelProps {
  items: WheelItem[];
  onSpinComplete: () => void;
  wheelId: string;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ items, onSpinComplete, wheelId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    isSpinning,
    wheelRotation,
    spinWheel,
    selectedItem,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorBySVGPointer
  } = useWheelSpin({ items, onSpinComplete, wheelId });
  const breakpoint = useBreakpoint();

  // Update visible sector when wheel rotation changes
  useEffect(() => {
    setVisibleSectorBySVGPointer(svgRef.current);
  }, [wheelRotation, setVisibleSectorBySVGPointer]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        maxWidth: SIZES.WHEEL_SIZE.desktop,
        margin: '0 auto',
      }}
    >
      <WheelArea
        wheelRef={svgRef}
        innerRadius={SIZES.WHEEL_SIZE[breakpoint] * SIZES.INNER_RADIUS_RATIO}
        outerRadius={SIZES.WHEEL_SIZE[breakpoint]}
        wheelRotation={wheelRotation}
        isSpinning={isSpinning}
        spinWheel={spinWheel}
        items={items}
        selectedItem={selectedItem}
        visibleSectorIndex={visibleSectorIndex}
        addImmunityToSelectedSector={addImmunityToSelectedSector}
      />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <WheelToolbar
          onSettingsClick={() => {}}
          onScreenshotClick={() => {}}
        />
        {selectedItem && (
          <ImmunityButton 
            onClick={addImmunityToSelectedSector}
            isVisible={!isSpinning}
            selectedSectorName={selectedItem.name}
          />
        )}
      </Box>
    </Box>
  );
};

export default FortuneWheel; 