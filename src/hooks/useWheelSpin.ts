import { useState, useCallback, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';

// Статичне сховище для зберігання даних між рендерами
const wheelState = {
  currentRotation: 0,
  isFirstRender: true,
  selectedSector: null as number | null,
  selectedMember: null as TeamMember | null
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
  const N = teamMembers.length;
  const degreesPerSector = 360 / N;
  
  const normalizedRotation = wheelRotation % 360;
  const pointerAngle = 270;
  let angleUnderPointer = (pointerAngle - normalizedRotation) % 360;
  if (angleUnderPointer < 0) angleUnderPointer += 360;
  
  let sectorIndex = Math.floor((angleUnderPointer - (degreesPerSector / 2)) / degreesPerSector);
  if (sectorIndex < 0) sectorIndex += N;
  sectorIndex = sectorIndex % N;
  
  return sectorIndex;
}

export const useWheelSpin = ({
  teamMembers,
  onSpinComplete,
  config = {},
}: UseWheelSpinProps): UseWheelSpinReturn & {
  setVisibleSectorBySVGPointer: (svg: SVGSVGElement | null, outerRadius: number, wheelRotation: number) => void;
} => {
  const [isSpinning, setIsSpinning] = useState(false);
  // Ініціалізуємо стан збереженим значенням rotation
  const [wheelRotation, setWheelRotation] = useState(() => {
    if (wheelState.isFirstRender) {
      const savedRotation = localStorage.getItem('wheelRotation');
      if (savedRotation) {
        const rotation = parseFloat(savedRotation);
        if (!isNaN(rotation)) {
          wheelState.currentRotation = rotation;
          wheelState.isFirstRender = false;
          return rotation;
        }
      }
      wheelState.isFirstRender = false;
    }
    return wheelState.currentRotation;
  });
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(wheelState.selectedMember);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(wheelState.selectedSector);
  const { spinDuration } = { ...DEFAULT_WHEEL_CONFIG, ...config };
  
  // Функції для безпечного оновлення стану
  const safeSetWheelRotation = useCallback((rotation: number) => {
    wheelState.currentRotation = rotation;
    if (rotation !== 0) {
      localStorage.setItem('wheelRotation', rotation.toString());
    }
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
  
  // Обертання колеса
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Перевірка на імунітет всіх секторів
    const allImmune = teamMembers.every((_, idx) => immunityService.hasSectorImmunity(idx));
    if (allImmune) {
      setIsSpinning(false);
      alert('All sectors have immunity!');
      return;
    }

    // Знаходимо доступні сектори (без імунітету)
    const availableSectors = teamMembers
      .map((member, index) => ({ index, member }))
      .filter(({ index }) => !immunityService.hasSectorImmunity(index));
    
    if (availableSectors.length === 0) {
      setIsSpinning(false);
      alert('All sectors have immunity!');
      return;
    }
    
    // Вибираємо випадковий сектор
    const randomIndex = Math.floor(Math.random() * availableSectors.length);
    const selectedSector = availableSectors[randomIndex];
    
    // Розрахунок ротації для забезпечення обертання за годинниковою стрілкою
    const currentRotation = wheelState.currentRotation % 360;
    const minRotations = 5;
    const maxRotations = 8;
    const fullRotations = minRotations + Math.floor(Math.random() * (maxRotations - minRotations + 1));
    
    const sectorAngle = 360 / teamMembers.length;
    const targetSectorMiddleAngle = selectedSector.index * sectorAngle + (sectorAngle / 2);
    
    const pointerAngle = 270;
    const targetRotationAngle = (pointerAngle - targetSectorMiddleAngle) % 360;
    
    const positiveTargetAngle = targetRotationAngle < 0 
      ? targetRotationAngle + 360 
      : targetRotationAngle;
    
    let angleToTarget = positiveTargetAngle - currentRotation;
    
    // Гарантуємо обертання за годинниковою стрілкою
    if (angleToTarget <= 0) {
      angleToTarget += 360;
    }
    
    const finalRotation = wheelState.currentRotation + angleToTarget + (fullRotations * 360);
    
    // Зберігаємо та застосовуємо ротацію
    wheelState.currentRotation = finalRotation;
    safeSetWheelRotation(finalRotation);

    // Анімуємо обертання
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = `transform ${spinDuration/1000}s cubic-bezier(0.32, 0, 0.15, 1)`;
      wheel.style.transform = `rotate(${finalRotation}deg)`;
    }
    
    // Завершення обертання
    setTimeout(() => {
      setIsSpinning(false);
      
      // Забезпечуємо збереження ротації
      wheelState.currentRotation = finalRotation;
      safeSetWheelRotation(finalRotation);
      syncRotationToDom();
      
      // Встановлюємо вибраний сектор
      safeSetVisibleSectorIndex(selectedSector.index);
      safeSetSelectedTeamMember(selectedSector.member);
      
      onSpinComplete();
    }, spinDuration + 100);
  }, [isSpinning, teamMembers, spinDuration, onSpinComplete, safeSetWheelRotation, safeSetVisibleSectorIndex, safeSetSelectedTeamMember, syncRotationToDom]);

  // Визначення сектора під вказівником
  const setVisibleSectorBySVGPointer = useCallback((
    svg: SVGSVGElement | null,
    outerRadius: number,
    incomingRotation: number
  ) => {
    if (!svg || isSpinning) return;
    
    // Використовуємо ефективну ротацію для визначення сектора
    const effectiveRotation = wheelState.currentRotation;
    const sectorIndex = getSectorUnderPointer(teamMembers, effectiveRotation);
    
    if (sectorIndex !== visibleSectorIndex) {
      safeSetVisibleSectorIndex(sectorIndex);
      safeSetSelectedTeamMember(teamMembers[sectorIndex]);
    }
  }, [isSpinning, teamMembers, visibleSectorIndex, safeSetVisibleSectorIndex, safeSetSelectedTeamMember]);

  return {
    isSpinning,
    wheelRotation,
    spinWheel,
    selectedTeamMember,
    visibleSectorIndex,
    addImmunityToSelectedSector: useCallback(() => {
      if (visibleSectorIndex !== null) {
        const memberName = teamMembers[visibleSectorIndex].name;
        immunityService.addImmunity(visibleSectorIndex, memberName);
        window.dispatchEvent(new Event('immunityChanged'));
      }
    }, [visibleSectorIndex, teamMembers]),
    setVisibleSectorIndexByPointer: safeSetVisibleSectorIndex,
    setVisibleSectorBySVGPointer,
  };
};