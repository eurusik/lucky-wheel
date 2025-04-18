import { useState, useCallback, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';

// Types for storing wheel state
interface WheelStateStorage {
  currentRotation: number;
  isFirstRender: boolean;
  selectedSector: number | null;
  selectedMember: TeamMember | null;
}

// Static storage for data between renders
const wheelState: WheelStateStorage = {
  currentRotation: 0,
  isFirstRender: true,
  selectedSector: null,
  selectedMember: null
};

interface UseWheelSpinProps {
  teamMembers: TeamMember[];
  onSpinComplete: () => void;
  config?: Partial<typeof DEFAULT_WHEEL_CONFIG>;
}

interface UseWheelSpinReturn {
  isSpinning: boolean;
  wheelRotation: number;
  selectedTeamMember: TeamMember | null;
  visibleSectorIndex: number | null;
  spinWheel: () => void;
  addImmunityToSelectedSector: () => void;
  setVisibleSectorIndexByPointer: (sectorIndex: number) => void;
  setVisibleSectorBySVGPointer: (svg: SVGSVGElement | null) => void;
}

// Local storage key for saving data
const WHEEL_STATE_KEY = 'wheelRotation';

// Get data from local storage
function getStoredRotation(): number | null {
  try {
    const stored = localStorage.getItem(WHEEL_STATE_KEY);
    if (!stored) return null;
    
    const rotation = parseFloat(stored);
    return isNaN(rotation) ? null : rotation;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Save rotation to local storage
function storeRotation(rotation: number): void {
  try {
    if (rotation !== 0) {
      localStorage.setItem(WHEEL_STATE_KEY, rotation.toString());
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// Calculate sector under pointer
function getSectorUnderPointer(teamMembers: TeamMember[], wheelRotation: number): number {
  if (teamMembers.length === 0) return 0;
  const n = teamMembers.length;
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
function getAvailableSectors(teamMembers: TeamMember[]): { index: number; member: TeamMember }[] {
  return teamMembers
    .map((member, index) => ({ index, member }))
    .filter(({ index }) => !immunityService.hasSectorImmunity(index));
}

export function useWheelSpin({
  teamMembers,
  onSpinComplete,
  config = {},
}: UseWheelSpinProps): UseWheelSpinReturn {
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Initialize state with saved rotation value
  const [wheelRotation, setWheelRotation] = useState(() => {
    if (wheelState.isFirstRender) {
      const storedRotation = getStoredRotation();
      if (storedRotation !== null) {
        wheelState.currentRotation = storedRotation;
      }
      wheelState.isFirstRender = false;
      return wheelState.currentRotation;
    }
    return wheelState.currentRotation;
  });
  
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(wheelState.selectedMember);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(wheelState.selectedSector);
  const { spinDuration = 5000 } = { ...DEFAULT_WHEEL_CONFIG, ...config };
  
  // Reference to track current state between renders
  const currentStateRef = useRef({
    visibleSectorIndex,
    selectedTeamMember
  });
  
  // Update the ref whenever the state changes
  useEffect(() => {
    currentStateRef.current = {
      visibleSectorIndex,
      selectedTeamMember
    };
  }, [visibleSectorIndex, selectedTeamMember]);
  
  // Reference to track the selected sector during a spin
  const selectedSectorRef = useRef<number | null>(null);
  
  // Functions for safe state updates
  const safeSetWheelRotation = useCallback((rotation: number) => {
    wheelState.currentRotation = rotation;
    storeRotation(rotation);
    setWheelRotation(rotation);
  }, []);
  
  const safeSetSelectedTeamMember = useCallback((member: TeamMember | null) => {
    wheelState.selectedMember = member;
    setSelectedTeamMember(member);
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
    if (sectorIndex < 0 || sectorIndex >= teamMembers.length) {
      console.error(`Invalid sector index: ${sectorIndex}`);
      return;
    }
    
    safeSetVisibleSectorIndex(sectorIndex);
    safeSetSelectedTeamMember(teamMembers[sectorIndex]);
    
    // Also store in localStorage for persistence
    wheelState.selectedSector = sectorIndex;
    wheelState.selectedMember = teamMembers[sectorIndex];
  }, [safeSetVisibleSectorIndex, safeSetSelectedTeamMember, teamMembers]);
  
  // Calculate rotation for target sector
  const calculateRotationForSector = useCallback((
    targetSectorIndex: number, 
    minimumRotations: number = 5,
    maximumRotations: number = 8
  ): number => {
    if (targetSectorIndex < 0 || targetSectorIndex >= teamMembers.length) {
      console.error(`Invalid target sector index: ${targetSectorIndex}`);
      return wheelState.currentRotation;
    }
    
    const currentRotation = wheelState.currentRotation % 360;
    const sectorAngle = 360 / teamMembers.length;
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
  }, [teamMembers.length]);
  
  // Spin the wheel
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    
    // Get available sectors (non-immune)
    const availableSectors = getAvailableSectors(teamMembers);
    if (availableSectors.length === 0) {
      console.error('All sectors are immune!');
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
      
      // Ensure rotation state is consistent
      wheelState.currentRotation = finalRotation;
      safeSetWheelRotation(finalRotation);
      syncRotationToDom();
      
      // Force-set the correct sector and team member
      setSelectedSector(sectorToLandOn);
      
      // Call the provided callback
      if (onSpinComplete) {
        onSpinComplete();
      }
    }, spinDuration + 100);
  }, [
    isSpinning,
    teamMembers,
    calculateRotationForSector,
    safeSetWheelRotation,
    syncRotationToDom,
    setSelectedSector,
    spinDuration,
    onSpinComplete
  ]);
  
  // Add immunity to selected sector
  const addImmunityToSelectedSector = useCallback(() => {
    if (visibleSectorIndex !== null) {
      const memberName = teamMembers[visibleSectorIndex].name;
      immunityService.addImmunity(visibleSectorIndex, memberName);
      window.dispatchEvent(new Event('immunityChanged'));
    }
  }, [visibleSectorIndex, teamMembers]);

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
    const sectorIndex = getSectorUnderPointer(teamMembers, effectiveRotation);
    
    if (sectorIndex !== visibleSectorIndex) {
      setSelectedSector(sectorIndex);
    }
  }, [isSpinning, teamMembers, visibleSectorIndex, setSelectedSector]);

  return {
    isSpinning,
    wheelRotation,
    spinWheel,
    selectedTeamMember,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorIndexByPointer: safeSetVisibleSectorIndex,
    setVisibleSectorBySVGPointer,
  };
}