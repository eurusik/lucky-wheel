import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { WheelItem } from '../types';
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
  items: WheelItem[];
  onSpinComplete: () => void;
  onScreenshot: () => void;
}

/**
 * Main component for the fortune wheel that combines all wheel parts
 */
const FortuneWheel: React.FC<FortuneWheelProps> = ({ items, onSpinComplete, onScreenshot }) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const { innerRadius, outerRadius } = DEFAULT_WHEEL_CONFIG;
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(items || []);

  // Update wheelItems when items prop changes
  useEffect(() => {
    setWheelItems(items || []);
  }, [items]);

  // Using useWheelSpin hook to manage wheel state
  const { 
    isSpinning, 
    wheelRotation, 
    spinWheel,
    selectedItem,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorBySVGPointer
  } = useWheelSpin({
    items: wheelItems,
    onSpinComplete,
  });

  // Update section under pointer after wheel stops
  useEffect(() => {
    // If the wheel just stopped spinning, update the sector immediately
    if (!isSpinning && wheelRef.current) {
      setVisibleSectorBySVGPointer(wheelRef.current);
    }
  }, [isSpinning, setVisibleSectorBySVGPointer]);

  // Handler for saving items list changes
  const handleSaveItems = useCallback((updated: WheelItem[]) => {
    setWheelItems(updated);
  }, []);

  // Handlers for settings dialog
  const handleOpenSettings = useCallback(() => setSettingsDialogOpen(true), []);
  const handleCloseSettings = useCallback(() => setSettingsDialogOpen(false), []);

  // If the list is empty, show empty wheel
  if (!wheelItems || wheelItems.length === 0) {
    return <EmptyWheel />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'center',
        width: '100%',
        m: '40px auto',
        background: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.01)',
        p: { xs: 3, md: 5 },
        gap: { xs: 4, md: 7 },
        '& > *:last-child': {
          marginLeft: { xs: 'auto', md: 'auto' },
          marginRight: { xs: 'auto', md: 0 },
          alignSelf: { xs: 'center', md: 'flex-start' }
        },
        boxSizing: 'border-box',
        border: '1px solid rgba(230, 235, 255, 0.9)',
      }}
    >
      <WheelToolbar 
        onSettingsClick={handleOpenSettings}
        onScreenshotClick={onScreenshot}
      />

      <SettingsDialog 
        open={settingsDialogOpen}
        onClose={handleCloseSettings}
        items={wheelItems}
        onSave={handleSaveItems}
      />

      <WheelArea
        wheelRef={wheelRef}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        wheelRotation={wheelRotation}
        isSpinning={isSpinning}
        spinWheel={spinWheel}
        items={wheelItems}
        selectedItem={selectedItem}
        visibleSectorIndex={visibleSectorIndex}
        addImmunityToSelectedSector={addImmunityToSelectedSector}
      />

      <LegendArea />
    </Box>
  );
};

export default React.memo(FortuneWheel);