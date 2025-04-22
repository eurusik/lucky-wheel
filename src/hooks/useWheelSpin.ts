import { useState, useCallback, useEffect, useRef } from 'react';
import { WheelItem } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';
import { useToast } from '../components/ui/ToastProvider';

// Types for storing wheel state
interface WheelStateStorage {
  currentRotation: number;
  isFirstRender: boolean;
  selectedSector: number | null;
  selectedItem: WheelItem | null;
}

// Static storage for data between renders
const wheelState: WheelStateStorage = {
  currentRotation: 0,
  isFirstRender: true,
  selectedSector: null,
  selectedItem: null
};

interface UseWheelSpinProps {
  items: WheelItem[];
  onSpinComplete: () => void;
  config?: Partial<typeof DEFAULT_WHEEL_CONFIG>;
}

import { getStoredRotation, storeRotation } from '../utils/wheelStateStorage';

// Calculate sector under pointer
function getSectorUnderPointer(items: WheelItem[], wheelRotation: number): number {
  if (items.length === 0) return 0;
  const n = items.length;
  const degreesPerSector = 360 / n;
  
  // Normalize the rotation to a value between 0 and 360
  const normalizedRotation = ((wheelRotation % 360) + 360) % 360;
  
  // The pointer is fixed at the top (270 degrees in standard math coordinates)
  const pointerAngle = 270;
  
  // Calculate the angle under the pointer
  // This gives us the angle in the wheel's coordinate system
  let angleUnderPointer = (pointerAngle - normalizedRotation) % 360;
  if (angleUnderPointer < 0) angleUnderPointer += 360;
  
  // Calculate the sector index
  // We adjust by half a sector angle to ensure the pointer is at the center of the sector
  let sectorIndex = Math.floor(angleUnderPointer / degreesPerSector);
  
  // Ensure we have a valid sector index
  sectorIndex = ((sectorIndex % n) + n) % n;
  
  return sectorIndex;
}

// Get all available sectors (without immunity)
async function getAvailableSectors(wheelId: string, items: WheelItem[]): Promise<{ index: number; item: WheelItem }[]> {
  const results: { index: number; item: WheelItem }[] = [];
  for (let index = 0; index < items.length; index++) {
    const hasImmunity = await immunityService.hasSectorImmunity(wheelId, index);
    if (!hasImmunity) {
      results.push({ index, item: items[index] });
    }
  }
  return results;
}

interface UseWheelSpinProps {
  wheelId: string;
  items: WheelItem[];
  onSpinComplete: () => void;
  config?: Partial<typeof DEFAULT_WHEEL_CONFIG>;
}

export const useWheelSpin = ({ wheelId, items, onSpinComplete }: UseWheelSpinProps) => {
  const { showToast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Initialize state with saved rotation value
  const [wheelRotation, setWheelRotation] = useState(() => {
    if (wheelState.isFirstRender) {
      const storedRotation = getStoredRotation(wheelId);
      if (storedRotation !== null) {
        wheelState.currentRotation = storedRotation;
      }
      wheelState.isFirstRender = false;
      return wheelState.currentRotation;
    }
    return wheelState.currentRotation;
  });
  
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(wheelState.selectedItem);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(wheelState.selectedSector);
  const { spinDuration = 5000 } = { ...DEFAULT_WHEEL_CONFIG };
  
  // Reference to track current state between renders
  const currentStateRef = useRef({
    visibleSectorIndex,
    selectedItem
  });
  
  // Update the ref whenever the state changes
  useEffect(() => {
    currentStateRef.current = {
      visibleSectorIndex,
      selectedItem
    };
  }, [visibleSectorIndex, selectedItem]);
  
  // Reference to track the selected sector during a spin
  const selectedSectorRef = useRef<number | null>(null);
  
  // Functions for safe state updates
  const safeSetWheelRotation = useCallback((rotation: number) => {
    wheelState.currentRotation = rotation;
    storeRotation(wheelId, rotation);
    setWheelRotation(rotation);
  }, [wheelId]);
  
  const safeSetSelectedItem = useCallback((item: WheelItem | null) => {
    wheelState.selectedItem = item;
    setSelectedItem(item);
  }, []);
  
  const safeSetVisibleSectorIndex = useCallback((index: number | null) => {
    wheelState.selectedSector = index;
    setVisibleSectorIndex(index);
  }, []);
  
  // Synchronize DOM with current rotation state
  const syncRotationToDom = useCallback(() => {
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = `rotate(${wheelState.currentRotation}deg)`;
    }
  }, []);
  
  // Update rotation when there's a mismatch
  useEffect(() => {
    if (wheelRotation !== wheelState.currentRotation && !isSpinning) {
      safeSetWheelRotation(wheelState.currentRotation);
      syncRotationToDom();
    }
  });
  
  // Helper function to set the selected sector and related states
  const setSelectedSector = useCallback((sectorIndex: number) => {
    if (sectorIndex < 0 || sectorIndex >= items.length) {
      console.error(`Invalid sector index: ${sectorIndex}`);
      return;
    }
    
    safeSetVisibleSectorIndex(sectorIndex);
    safeSetSelectedItem(items[sectorIndex]);
    
    // Also store in localStorage for persistence
    wheelState.selectedSector = sectorIndex;
    wheelState.selectedItem = items[sectorIndex];
  }, [safeSetVisibleSectorIndex, safeSetSelectedItem, items]);
  
  // Calculate rotation for target sector
  const calculateRotationForSector = useCallback((
    targetSectorIndex: number, 
    minimumRotations: number = 5,
    maximumRotations: number = 8
  ): number => {
    if (!items || targetSectorIndex < 0 || targetSectorIndex >= items.length) {
      console.error(`Invalid target sector index: ${targetSectorIndex}`);
      return wheelState.currentRotation;
    }
    
    const currentRotation = wheelState.currentRotation % 360;
    const sectorAngle = 360 / items.length;
    const targetSectorMiddleAngle = targetSectorIndex * sectorAngle + (sectorAngle / 2);
    
    // 270° - pointer position (top)
    const pointerAngle = 270;
    const targetRotationAngle = (pointerAngle - targetSectorMiddleAngle) % 360;
    
    // Ensure positive angle
    const positiveTargetAngle = targetRotationAngle < 0 
      ? targetRotationAngle + 360 
      : targetRotationAngle;
    
    // Calculate angle to target
    let angleToTarget = positiveTargetAngle - currentRotation;
    
    // Ensure clockwise rotation
    if (angleToTarget <= 0) {
      angleToTarget += 360;
    }
    
    // Random number of full rotations
    const fullRotations = minimumRotations + 
      Math.floor(Math.random() * (maximumRotations - minimumRotations + 1));
    
    // Final rotation
    return wheelState.currentRotation + angleToTarget + (fullRotations * 360);
  }, [items]);
  
  // Spin the wheel
  const spinWheel = useCallback(async () => {
    if (isSpinning) return;
    
    // Get available sectors (non-immune)
    const availableSectors = await getAvailableSectors(wheelId, items);
    if (availableSectors.length === 0) {
      showToast('All sectors are immune!', 'warning');
      return;
    }

    // Pick a random sector from available ones
    const selectedSectorIndex = Math.floor(Math.random() * availableSectors.length);
    const targetSector = availableSectors[selectedSectorIndex];
    const sectorToLandOn = targetSector.index;
    
    // Calculate target rotation using the existing function
    const finalRotation = calculateRotationForSector(sectorToLandOn);

    // Store the selected sector for recovery if needed
    selectedSectorRef.current = sectorToLandOn;
    
    // Start spinning animation
    setIsSpinning(true);
    
    // Save and apply rotation using the safe setter
    wheelState.currentRotation = finalRotation;
    safeSetWheelRotation(finalRotation);
    
    // Update DOM with spinning animation
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = `transform ${spinDuration/1000}s cubic-bezier(0.32, 0, 0.15, 1)`;
      wheel.style.transform = `rotate(${finalRotation}deg)`;
    }
    
    // After spin completes, update the state
    setTimeout(() => {
      setIsSpinning(false);
      setWheelRotation(finalRotation);
      setSelectedSector(sectorToLandOn);
      setSelectedItem(items[sectorToLandOn]);
      onSpinComplete();
      
      // Show toast with selected sector name and candy emojis
      const selectedItem = items[sectorToLandOn];
      showToast(`🎉 Congratulations! Selected: <b style="font-size: 1.2em">${selectedItem.name}</b> 🍬`, 'info');
    }, spinDuration);
  },
    [
      isSpinning,
      items,
      calculateRotationForSector,
      safeSetWheelRotation,
      setSelectedSector,
      spinDuration,
      onSpinComplete,
      showToast,
      wheelId
    ]
  );
  
  // Add immunity to selected sector
  const addImmunityToSelectedSector = useCallback(async () => {
    if (visibleSectorIndex !== null) {
      const itemName = items[visibleSectorIndex].name;
      try {
        const hasImmunity = await immunityService.hasSectorImmunity(wheelId, visibleSectorIndex);
        if (hasImmunity) {
          showToast(`Sector "${itemName}" already has immunity!`, 'warning');
          return;
        }
        await immunityService.addImmunity(wheelId, visibleSectorIndex, itemName);
        window.dispatchEvent(new Event('immunityChanged'));
        showToast(`Immunity added to sector "${itemName}" 🛡️`, 'success');
      } catch {
        showToast('Failed to add immunity. Please try again.', 'error');
      }
    }
  }, [visibleSectorIndex, items, wheelId, showToast]);

  // Determine sector under pointer
  const setVisibleSectorBySVGPointer = useCallback((svg: SVGSVGElement | null) => {
    // Skip if we're spinning or don't have an SVG reference
    if (!svg || isSpinning) {
      return;
    }
    
    // Skip if we recently completed a spin (the spinWheel function will handle selection)
    if (selectedSectorRef.current !== null) {
      const selectedSector = selectedSectorRef.current;
      
      // Check if we should apply our selected sector instead of calculating from rotation
      if (selectedSector !== visibleSectorIndex) {
        setSelectedSector(selectedSector);
        // Clear the selected sector ref so future rotations can be handled normally
        setTimeout(() => {
          selectedSectorRef.current = null;
        }, 500);
        return;
      }
      
      // If we already have the correct sector, clear the ref
      selectedSectorRef.current = null;
    }
    
    // Use effective rotation to determine sector
    const effectiveRotation = wheelState.currentRotation;
    const sectorIndex = getSectorUnderPointer(items, effectiveRotation);
    
    if (sectorIndex !== visibleSectorIndex) {
      setSelectedSector(sectorIndex);
    }
  }, [isSpinning, items, visibleSectorIndex, setSelectedSector]);

  return {
    isSpinning,
    wheelRotation,
    spinWheel,
    selectedItem,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorBySVGPointer
  };
};