import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { takeScreenshot } from '../utils/screenshot';
import { WheelItem } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { useWheelSpin } from '../hooks/useWheelSpin';
import EmptyWheel from './wheel/EmptyWheel';
import WheelToolbar from './wheel/WheelToolbar';
import Loader from './ui/Loader';
import SettingsDialog from './wheel/SettingsDialog';
import WheelArea from './wheel/WheelArea';
import LegendArea from './wheel/LegendArea';

/**
 * Props for the FortuneWheel component
 */
interface FortuneWheelProps {
  id?: string;
  items: WheelItem[];
  onSpinComplete: () => void;
  onItemsChange?: (items: WheelItem[]) => void;
}

/**
 * Main component for the fortune wheel that combines all wheel parts
 */
const FortuneWheel: React.FC<FortuneWheelProps> = ({ 
  id,
  items, 
  onSpinComplete, 
  onItemsChange
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const { innerRadius, outerRadius } = DEFAULT_WHEEL_CONFIG;
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(items || []);

  // Update wheelItems when items prop changes
  useEffect(() => {
    setWheelItems(items || []);
  }, [items]);

  // Using useWheelSpin hook to manage wheel state
  const wheelId = id || wheelItems[0]?.id || '';
  const {
    isInitializing,
    isSpinning, 
    wheelRotation, 
    spinWheel,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorBySVGPointer
  } = useWheelSpin({
    wheelId,
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
    // Call the parent component's onItemsChange if provided
    if (onItemsChange) {
      onItemsChange(updated);
    }
  }, [onItemsChange]);

  // Handlers for settings dialog
  const handleOpenSettings = useCallback(() => setSettingsDialogOpen(true), []);
  const handleCloseSettings = useCallback(() => setSettingsDialogOpen(false), []);

  // Screenshot handler (copies screenshot of the wheel to clipboard)
  const handleScreenshot = useCallback(async () => {
    if (wheelRef.current) {
      // Optionally, you could screenshot just the SVG or the whole area
      await takeScreenshot();
    }
  }, []);

  // Show minimal loader if wheelItems not yet initialized (very first render)
  if (!wheelItems || wheelItems.length === 0) {
    return <Loader label="Loading wheel..." container={false} />;
  }

  // If isInitializing but wheelItems exist, render nothing (or could render skeleton)
  if (isInitializing) {
    return null;
  }

  // If the list is empty, show empty wheel
  if (!wheelItems || wheelItems.length === 0) {
    return <EmptyWheel />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
        alignItems: { xs: 'center', sm: 'center', md: 'flex-start', lg: 'flex-start' },
        '@media (max-width:1024px)': {
          flexDirection: 'column',
          alignItems: 'center',
        },
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
          alignSelf: { xs: 'center', md: 'flex-start' },
          '@media (max-width:1024px)': {
            marginLeft: 'auto',
            marginRight: 'auto',
            alignSelf: 'center',
          },
          '@media (max-width:900px)': {
            marginLeft: 'auto',
            marginRight: 'auto',
            alignSelf: 'center',
          }
        },
        boxSizing: 'border-box',
        border: '1px solid rgba(230, 235, 255, 0.9)',
      }}
    >
      <WheelToolbar 
        onSettingsClick={handleOpenSettings}
        onScreenshotClick={handleScreenshot}
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
        visibleSectorIndex={visibleSectorIndex}
        addImmunityToSelectedSector={addImmunityToSelectedSector}
        wheelId={wheelId}
      />

      <LegendArea wheelId={wheelId} />
    </Box>
  );
};

export default React.memo(FortuneWheel);