import { useState, useCallback, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';

// Типи для зберігання стану колеса
interface WheelStateStorage {
  currentRotation: number;
  isFirstRender: boolean;
  selectedSector: number | null;
  selectedMember: TeamMember | null;
}

// Статичне сховище для зберігання даних між рендерами
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
  setVisibleSectorBySVGPointer: (svg: SVGSVGElement | null, outerRadius: number, wheelRotation: number) => void;
}

// Локальне сховище для збереження даних
const WHEEL_STATE_KEY = 'wheelRotation';

// Отримання даних з локального сховища
function getStoredRotation(): number | null {
  const stored = localStorage.getItem(WHEEL_STATE_KEY);
  if (!stored) return null;
  
  const rotation = parseFloat(stored);
  return isNaN(rotation) ? null : rotation;
}

// Збереження ротації в локальне сховище
function storeRotation(rotation: number): void {
  if (rotation !== 0) {
    localStorage.setItem(WHEEL_STATE_KEY, rotation.toString());
  }
}

// Пошук наступного доступного сектора, починаючи з startIndex
function findNextAvailableSector(teamMembers: TeamMember[], startIndex: number): number | null {
  const n = teamMembers.length;
  for (let i = 0; i < n; ++i) {
    const idx = (startIndex + i) % n;
    if (!immunityService.hasSectorImmunity(idx)) return idx;
  }
  return null;
}

// Розрахунок сектора під вказівником
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
  
  console.log(`🔍 Calculating sector: Rotation=${wheelRotation}°, Normalized=${normalizedRotation}°, Angle=${angleUnderPointer}°, Sector=${sectorIndex}`);
  
  return sectorIndex;
}

// Отримання всіх доступних секторів (без імунітету)
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
  
  // Ініціалізуємо стан збереженим значенням rotation
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
  
  // Функції для безпечного оновлення стану
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
  
  // Helper function to log immunity state for debugging
  const logImmunityState = useCallback((teamMembers: TeamMember[]) => {
    console.log('🛡️ Current immunity state:');
    teamMembers.forEach((member, index) => {
      const hasImmunity = immunityService.hasSectorImmunity(index);
      console.log(`Sector #${index} (${member.name}): ${hasImmunity ? '🛡️ IMMUNE' : '⚔️ NOT IMMUNE'}`);
    });
  }, []);
  
  // Синхронізація DOM з поточним станом ротації
  const syncRotationToDom = useCallback(() => {
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = `rotate(${wheelState.currentRotation}deg)`;
    }
  }, []);
  
  // Оновлюємо rotation при невідповідності
  useEffect(() => {
    if (wheelRotation !== wheelState.currentRotation && !isSpinning) {
      safeSetWheelRotation(wheelState.currentRotation);
      syncRotationToDom();
    }
  });
  
  // Helper function to set the selected sector and related states
  const setSelectedSector = useCallback((sectorIndex: number) => {
    safeSetVisibleSectorIndex(sectorIndex);
    safeSetSelectedTeamMember(teamMembers[sectorIndex]);
    
    // Also store in localStorage for persistence
    wheelState.selectedSector = sectorIndex;
    wheelState.selectedMember = teamMembers[sectorIndex];
  }, [safeSetVisibleSectorIndex, safeSetSelectedTeamMember, teamMembers]);
  
  // Розрахунок ротації для цільового сектора
  const calculateRotationForSector = useCallback((
    targetSectorIndex: number, 
    minimumRotations: number = 5,
    maximumRotations: number = 8
  ): number => {
    const currentRotation = wheelState.currentRotation % 360;
    const sectorAngle = 360 / teamMembers.length;
    const targetSectorMiddleAngle = targetSectorIndex * sectorAngle + (sectorAngle / 2);
    
    // 270° - позиція вказівника (верх)
    const pointerAngle = 270;
    const targetRotationAngle = (pointerAngle - targetSectorMiddleAngle) % 360;
    
    // Гарантуємо позитивний кут
    const positiveTargetAngle = targetRotationAngle < 0 
      ? targetRotationAngle + 360 
      : targetRotationAngle;
    
    // Розрахунок кута до цілі
    let angleToTarget = positiveTargetAngle - currentRotation;
    
    // Гарантуємо обертання за годинниковою стрілкою
    if (angleToTarget <= 0) {
      angleToTarget += 360;
    }
    
    // Випадкова кількість повних обертів
    const fullRotations = minimumRotations + 
      Math.floor(Math.random() * (maximumRotations - minimumRotations + 1));
    
    // Фінальна ротація
    return wheelState.currentRotation + angleToTarget + (fullRotations * 360);
  }, [teamMembers.length]);
  
  // Обертання колеса
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
  
    // Log immunity state before spinning
    logImmunityState(teamMembers);

    // Store current state before resetting
    const previousState = {
      visibleSectorIndex: visibleSectorIndex,
      selectedTeamMember: selectedTeamMember,
    };
    console.log('📊 State before spinning:', previousState);

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
    
    console.log('🎯 Selected sector to land on:', sectorToLandOn, 'Team member:', targetSector.member);

    // Calculate target rotation using the existing function
    const finalRotation = calculateRotationForSector(sectorToLandOn);
    console.log(`🔄 Starting spin from ${wheelRotation}° to ${finalRotation}° to land on sector ${sectorToLandOn}`);

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
      console.log('🛑 Wheel stopped at rotation:', finalRotation);
      
      // Ensure rotation state is consistent
      wheelState.currentRotation = finalRotation;
      safeSetWheelRotation(finalRotation);
      syncRotationToDom();
      
      // Force-set the correct sector and team member
      console.log('🔄 Setting visible sector to:', sectorToLandOn);
      setSelectedSector(sectorToLandOn);
      
      // Call the provided callback
      if (onSpinComplete) {
        onSpinComplete();
      }
      
      // Add multiple recovery checks to ensure state isn't reset
      setTimeout(() => checkAndRecoverState(sectorToLandOn), 100);
      setTimeout(() => checkAndRecoverState(sectorToLandOn), 500);
      setTimeout(() => checkAndRecoverState(sectorToLandOn), 1000);
      setTimeout(() => checkAndRecoverState(sectorToLandOn), 2000);
    }, spinDuration + 100);
  }, [
    isSpinning,
    logImmunityState,
    teamMembers,
    visibleSectorIndex,
    selectedTeamMember,
    calculateRotationForSector,
    safeSetWheelRotation,
    syncRotationToDom,
    setSelectedSector,
    spinDuration,
    onSpinComplete,
    wheelRotation
  ]);
  
  // Helper function to check and recover state if needed
  const checkAndRecoverState = useCallback((expectedSector: number) => {
    const currentVisibleSector = currentStateRef.current.visibleSectorIndex;
    if (currentVisibleSector !== expectedSector) {
      console.warn('🚨 State recovery needed! Current:', currentVisibleSector, 'Expected:', expectedSector);
      setSelectedSector(expectedSector);
    } else {
      console.log(`✅ Sector verified: ${expectedSector}`);
    }
  }, [setSelectedSector]);
  
  // Додає імунітет вибраному сектору
  const addImmunityToSelectedSector = useCallback(() => {
    if (visibleSectorIndex !== null) {
      const memberName = teamMembers[visibleSectorIndex].name;
      immunityService.addImmunity(visibleSectorIndex, memberName);
      window.dispatchEvent(new Event('immunityChanged'));
    }
  }, [visibleSectorIndex, teamMembers]);

  // Визначення сектора під вказівником
  const setVisibleSectorBySVGPointer = useCallback((
    svg: SVGSVGElement | null,
    outerRadius: number,
    incomingRotation: number
  ) => {
    // Skip if we're spinning or don't have an SVG reference
    if (!svg || isSpinning) {
      console.log('🔄 Wheel is spinning or no SVG ref, skipping setVisibleSectorBySVGPointer');
      return;
    }
    
    // Skip if we recently completed a spin (the spinWheel function will handle selection)
    if (selectedSectorRef.current !== null) {
      const selectedSector = selectedSectorRef.current;
      
      // Check if we should apply our selected sector instead of calculating from rotation
      if (selectedSector !== visibleSectorIndex) {
        console.log(`🎯 Using pre-selected sector ${selectedSector} instead of calculating from rotation`);
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
    
    // Використовуємо ефективну ротацію для визначення сектора
    const effectiveRotation = wheelState.currentRotation;
    const sectorIndex = getSectorUnderPointer(teamMembers, effectiveRotation);
    
    console.log(`🔄 Wheel rotation: ${effectiveRotation}°, Sector under pointer: ${sectorIndex}`);
    
    if (sectorIndex !== visibleSectorIndex) {
      console.log(`🔍 Setting visible sector from ${visibleSectorIndex} to ${sectorIndex} based on rotation ${effectiveRotation}°`);
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