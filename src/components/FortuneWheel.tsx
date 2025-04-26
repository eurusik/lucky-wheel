import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { shareWheelLink, takeWheelScreenshot } from '../utils/wheelActions';
import { WheelItem } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { useWheelSpin } from '../hooks/useWheelSpin';
import { useWheelData } from '../hooks/useWheelData';
import { useDialogState } from '../hooks/useDialogState';
import EmptyWheel from './wheel/EmptyWheel';
import WheelToolbar from './wheel/WheelToolbar';
import Loader from './ui/Loader';
import SettingsDialog from './wheel/SettingsDialog';
import WheelArea from './wheel/WheelArea';
import LegendArea from './wheel/LegendArea';
import { useToast } from './ui/ToastTypes';

/**
 * Props for the FortuneWheel component
 */
interface FortuneWheelProps {
  id?: string;
  name: string;
  items: WheelItem[];
  onSpinComplete: () => void;
  onWheelSettingsChange: (items: WheelItem[], name: string) => void;
}

/**
 * Main component for the fortune wheel that combines all wheel parts
 */
const FortuneWheel: React.FC<FortuneWheelProps> = ({ 
  id,
  name,
  items, 
  onSpinComplete,
  onWheelSettingsChange = () => {}
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const { innerRadius, outerRadius } = DEFAULT_WHEEL_CONFIG;
  const { showToast } = useToast();
  
  // Using useWheelData hook to manage wheel data
  const {
    wheelItems,
    wheelName,
    wheelId,
    isLoading,
    error,
    handleSettingsSave
  } = useWheelData({
    id,
    initialItems: items,
    initialName: name,
    onWheelSettingsChange
  });
  
  // Use the useDialogState hook for settings dialog state and handlers
  const {
    isOpen: settingsDialogOpen,
    openDialog: handleOpenSettings,
    closeDialog: handleCloseSettings
  } = useDialogState();

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

  // Screenshot handler (copies screenshot of the wheel to clipboard)
  const handleScreenshot = useCallback(() => {
    takeWheelScreenshot(showToast);
  }, [showToast]);

  // Handler for sharing wheel link
  const handleShare = useCallback(() => {
    shareWheelLink(id || wheelId, showToast);
  }, [id, wheelId, showToast]);

  // Use useEffect to show error toast when error occurs
  useEffect(() => {
    if (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }, [error, showToast]);
  
  // We could also return an error component instead of continuing if error exists
  // if (error) {
  //   return <ErrorComponent message={error.message} />;
  // }

  if (isLoading) {
    return <Loader label="Loading wheel..." container={false} />;
  }

  if (isInitializing) {
    return <Loader label="Initializing wheel..." container={false} />;
  }
  
  if (!wheelItems || wheelItems.length === 0) {
    return (
      <>
        <EmptyWheel onOpenSettings={handleOpenSettings} />
        <SettingsDialog 
          open={settingsDialogOpen}
          onClose={handleCloseSettings}
          items={wheelItems || []}
          wheelName={wheelName}
          onSave={handleSettingsSave}
        />
      </>
    );
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
        onShareClick={handleShare}
      />

      <SettingsDialog 
        open={settingsDialogOpen}
        onClose={handleCloseSettings}
        items={wheelItems}
        wheelName={wheelName}
        onSave={handleSettingsSave}
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