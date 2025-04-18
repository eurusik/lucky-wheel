import { useState, useCallback, useEffect, useRef } from 'react';
import { WheelItem } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';
import { useToast } from '../components/ui/ToastProvider';
import { storageService } from '../services/storageService';

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
  wheelId: string;
}

// Local storage key for saving data
const WHEEL_STATE_KEY = 'wheelRotation';

// Get data from local storage for specific wheel
function getStoredRotation(wheelId: string): number | null {
  try {
    const stored = localStorage.getItem(`wheel_rotation_${wheelId}`);
    if (!stored) return null;
    
    const rotation = parseFloat(stored);
    return isNaN(rotation) ? null : rotation;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Save rotation to local storage for specific wheel
function storeRotation(wheelId: string, rotation: number): void {
  try {
    if (rotation !== 0) {
      localStorage.setItem(`wheel_rotation_${wheelId}`, rotation.toString());
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

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
function getAvailableSectors(items: WheelItem[]): { index: number; item: WheelItem }[] {
  return items
    .map((item, index) => ({ index, item }))
    .filter(({ index }) => !immunityService.hasSectorImmunity(index));
}

export const useWheelSpin = ({ items, onSpinComplete, wheelId }: UseWheelSpinProps) => {
  const { showToast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Initialize state with saved rotation value for this specific wheel
  const [wheelRotation, setWheelRotation] = useState(() => {
    const data = storageService.getWheelData(wheelId);
    return data?.rotation ?? 0;
  });
  
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(null);
  
  // Get spin duration from storage or use default
  const [spinDuration, setSpinDuration] = useState<number>(() => {
    const data = storageService.getWheelData(wheelId);
    return data?.spinDuration ?? 5000;
  });

  // Reference to track current state between renders
  const currentStateRef = useRef({
    wheelRotation,
    selectedItem,
    visibleSectorIndex,
    isSpinning
  });

  // Update ref when state changes
  useEffect(() => {
    currentStateRef.current = {
      wheelRotation,
      selectedItem,
      visibleSectorIndex,
      isSpinning
    };
  }, [wheelRotation, selectedItem, visibleSectorIndex, isSpinning]);

  // Reference to track the selected sector during a spin
  const selectedSectorRef = useRef<number | null>(null);
  
  // Functions for safe state updates
  const safeSetWheelRotation = useCallback((rotation: number) => {
    storageService.updateRotation(wheelId, rotation);
    setWheelRotation(rotation);
  }, [wheelId]);
  
  const safeSetSelectedItem = useCallback((item: WheelItem | null) => {
    setSelectedItem(item);
  }, []);
  
  const safeSetVisibleSectorIndex = useCallback((index: number | null) => {
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
  const spinWheel = useCallback((): void => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const startRotation = wheelRotation;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = startRotation + (360 * 5 + Math.random() * 360) * easeOut(progress);
      
      setWheelRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = currentRotation % 360;
        setWheelRotation(finalRotation);
        storageService.updateRotation(wheelId, finalRotation);
        
        const sector = getSectorUnderPointer(items, finalRotation);
        const selectedItem = items[sector];
        setSelectedItem(selectedItem);
        setVisibleSectorIndex(sector);
        
        if (onSpinComplete) {
          onSpinComplete();
        }
      }
    };
    
    requestAnimationFrame(animate);
  }, [isSpinning, wheelRotation, spinDuration, items, onSpinComplete, wheelId]);
  
  // Add immunity to selected sector
  const addImmunityToSelectedSector = useCallback(() => {
    if (visibleSectorIndex !== null) {
      const itemName = items[visibleSectorIndex].name;
      immunityService.addImmunity(wheelId, visibleSectorIndex, itemName);
      window.dispatchEvent(new Event('immunityChanged'));
    }
  }, [visibleSectorIndex, items, wheelId]);

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