import { useState, useCallback, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { DEFAULT_WHEEL_CONFIG } from '../constants/wheelConfig';
import { immunityService } from '../services/immunityService';

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

// Статичне сховище для зберігання даних між рендерами
// Оскільки це знаходиться поза компонентом, воно не скидається при рендері
const wheelState = {
  currentRotation: 0,
  isFirstRender: true,
  selectedSector: null as number | null,
  selectedMember: null as TeamMember | null
};

// --- Helpers ---
/**
 * Returns the index of the next available (non-immune) sector, starting from a given index.
 * Returns null if all sectors have immunity.
 */
function findNextAvailableSector(teamMembers: TeamMember[], startIndex: number): number | null {
  const n = teamMembers.length;
  for (let i = 0; i < n; ++i) {
    const idx = (startIndex + i) % n;
    if (!immunityService.hasSectorImmunity(idx)) return idx;
  }
  return null;
}

/**
 * Calculates which sector is currently under the pointer (270°/top).
 */
function getSectorUnderPointer(teamMembers: TeamMember[], wheelRotation: number): number {
  if (teamMembers.length === 0) return 0;
  const N = teamMembers.length;
  const degreesPerSector = 360 / N;
  
  // Нормалізуємо ротацію до 0-360
  const normalizedRotation = wheelRotation % 360;
  
  // Вказівник знаходиться на 270° (верх)
  // Це означає, що кут 0° (вправо) відповідає 3/4 кола від вказівника
  const pointerAngle = 270;
  
  // Розраховуємо кут під вказівником
  // Це поточне положення колеса після ротації
  let angleUnderPointer = (pointerAngle - normalizedRotation) % 360;
  if (angleUnderPointer < 0) angleUnderPointer += 360;
  
  // Знаходимо індекс сектора
  // Корекція на половину сектора - це дозволяє вказівнику вказувати на центр сектора
  let sectorIndex = Math.floor((angleUnderPointer - (degreesPerSector / 2)) / degreesPerSector);
  // Обробка пограничного випадку
  if (sectorIndex < 0) sectorIndex += N;
  sectorIndex = sectorIndex % N;
  
  console.log(`Wheel rotation: ${normalizedRotation}°, Angle under pointer: ${angleUnderPointer}°, Sector: ${sectorIndex}`);
  
  return sectorIndex;
}

// --- Main Hook ---
/**
 * Custom hook for managing wheel spin logic, sector selection, and immunity.
 * Now also exposes setVisibleSectorBySVGPointer for hit-testing pointer over SVG sectors.
 */
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
    // При першому рендері спробуємо відновити з localStorage
    if (wheelState.isFirstRender) {
      const savedRotation = localStorage.getItem('wheelRotation');
      if (savedRotation) {
        const rotation = parseFloat(savedRotation);
        if (!isNaN(rotation)) {
          console.log(`Initializing from localStorage: rotation=${rotation}`);
          wheelState.currentRotation = rotation;
          wheelState.isFirstRender = false;
          return rotation;
        }
      }
      wheelState.isFirstRender = false;
    }
    // В інших випадках використовуємо збережене значення
    return wheelState.currentRotation;
  });
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(wheelState.selectedMember);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(wheelState.selectedSector);
  const { spinDuration } = { ...DEFAULT_WHEEL_CONFIG, ...config };
  
  // Перезаписуємо стандартний setState для wheelRotation
  const safeSetWheelRotation = useCallback((rotation: number) => {
    console.log(`Setting wheel rotation to ${rotation}`);
    // Зберігаємо значення в нашому статичному сховищі
    wheelState.currentRotation = rotation;
    // Зберігаємо в localStorage для відновлення між сесіями
    if (rotation !== 0) {
      localStorage.setItem('wheelRotation', rotation.toString());
    }
    // Оновлюємо React-стан
    setWheelRotation(rotation);
  }, []);
  
  // Перезаписуємо стандартний setState для selectedTeamMember
  const safeSetSelectedTeamMember = useCallback((member: TeamMember | null) => {
    wheelState.selectedMember = member;
    setSelectedTeamMember(member);
  }, []);
  
  // Перезаписуємо стандартний setState для visibleSectorIndex
  const safeSetVisibleSectorIndex = useCallback((index: number | null) => {
    wheelState.selectedSector = index;
    setVisibleSectorIndex(index);
  }, []);
  
  // Функція для синхронізації DOM з поточним станом ротації
  const syncRotationToDom = useCallback(() => {
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = `rotate(${wheelState.currentRotation}deg)`;
      console.log(`Synced DOM rotation to ${wheelState.currentRotation}°`);
    }
  }, []);
  
  // При кожному рендері оновлюємо rotation, якщо воно змінилося
  useEffect(() => {
    if (wheelRotation !== wheelState.currentRotation && !isSpinning) {
      console.log(`Rotation mismatch detected: state=${wheelRotation}, stored=${wheelState.currentRotation}`);
      safeSetWheelRotation(wheelState.currentRotation);
      syncRotationToDom();
    }
  });
  
  /**
   * Spins the wheel to a random available sector (skipping immune sectors).
   */
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    console.log('=== Starting wheel spin ===');
    
    // Check if all sectors have immunity
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
    
    // Вибираємо випадковий сектор з доступних
    const randomIndex = Math.floor(Math.random() * availableSectors.length);
    const selectedSector = availableSectors[randomIndex];
    
    console.log(`Selected target sector #${selectedSector.index}: ${selectedSector.member.name}`);
    
    // ЗАВЖДИ крутимось в позитивну сторону (за годинниковою стрілкою)
    // Розраховуємо поточне значення ротації нормалізоване до 0-360
    const currentRotation = wheelState.currentRotation % 360;
    console.log(`Current rotation (normalized): ${currentRotation}°`);
    
    // Розраховуємо кількість обертів - ЗАВЖДИ від 5 до 8 повних обертів ЗА годинниковою стрілкою
    const minRotations = 5;
    const maxRotations = 8;
    const fullRotations = minRotations + Math.floor(Math.random() * (maxRotations - minRotations + 1));
    
    // Розраховуємо кут для цільового сектора
    const sectorAngle = 360 / teamMembers.length;
    const targetSectorMiddleAngle = selectedSector.index * sectorAngle + (sectorAngle / 2);
    
    // Вказівник знаходиться на 270° (верх)
    // Для того, щоб цільовий сектор опинився під вказівником,
    // ми повинні повернути колесо на такий кут, щоб середина сектора була на 270°
    const pointerAngle = 270;
    const targetRotationAngle = (pointerAngle - targetSectorMiddleAngle) % 360;
    
    // Гарантуємо позитивний кут
    const positiveTargetAngle = targetRotationAngle < 0 
      ? targetRotationAngle + 360 
      : targetRotationAngle;
    
    // Розраховуємо фінальну ротацію:
    // 1. Беремо поточну ротацію
    // 2. Додаємо повні оберти (мінімум 5, максимум 8)
    // 3. Додаємо кут, необхідний для вирівнювання цільового сектора з вказівником
    
    // Спочатку визначаємо найближчий кут, на який треба обернути колесо,
    // щоб від поточного положення дійти до цільового
    let angleToTarget = positiveTargetAngle - currentRotation;
    
    // Гарантуємо, що ми завжди повертаємо колесо ЗА годинниковою стрілкою (позитивний кут)
    if (angleToTarget <= 0) {
      angleToTarget += 360;
    }
    
    // Фінальна ротація = поточна ротація + кут до цілі + повні оберти
    const finalRotation = wheelState.currentRotation + angleToTarget + (fullRotations * 360);
    
    console.log(`Current rotation: ${wheelState.currentRotation}°`);
    console.log(`Target sector angle: ${targetSectorMiddleAngle}°`);
    console.log(`Target rotation angle: ${positiveTargetAngle}°`);
    console.log(`Angle to target: ${angleToTarget}°`);
    console.log(`Will do ${fullRotations} full rotations`);
    console.log(`Final rotation: ${finalRotation}°`);

    // Зберігаємо фінальну ротацію в сховищі
    wheelState.currentRotation = finalRotation;
    safeSetWheelRotation(finalRotation);

    // Анімуємо обертання колеса
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      console.log("Wheel element found, applying rotation animation");
      // Використовуємо cubic-bezier для плавного прискорення і сповільнення
      // cubic-bezier(0.32, 0, 0.15, 1) - забезпечує швидке прискорення і довге сповільнення
      wheel.style.transition = `transform ${spinDuration/1000}s cubic-bezier(0.32, 0, 0.15, 1)`;
      wheel.style.transform = `rotate(${finalRotation}deg)`;
    } else {
      console.error("Wheel element not found!");
    }
    
    setTimeout(() => {
      console.log(`Spin completed. Final rotation = ${finalRotation}`);
      setIsSpinning(false);
      
      // Після завершення спіну, зберігаємо ротацію знову для певності
      wheelState.currentRotation = finalRotation;
      safeSetWheelRotation(finalRotation);
      
      // Оновлюємо DOM для певності
      syncRotationToDom();
      
      // Встановлюємо вибраний сектор
      safeSetVisibleSectorIndex(selectedSector.index);
      safeSetSelectedTeamMember(selectedSector.member);
      
      console.log(`Wheel stopped. Selected sector #${selectedSector.index}: ${selectedSector.member.name}`);
      
      onSpinComplete();
    }, spinDuration + 100);
  }, [isSpinning, teamMembers, spinDuration, onSpinComplete, safeSetWheelRotation, safeSetVisibleSectorIndex, safeSetSelectedTeamMember, syncRotationToDom]);

  /**
   * Hit-testing logic to determine which sector is under the pointer (SVG version).
   * Should be called from the UI with svg ref, outerRadius, and wheelRotation.
   */
  const setVisibleSectorBySVGPointer = useCallback((
    svg: SVGSVGElement | null,
    outerRadius: number,
    incomingRotation: number
  ) => {
    if (!svg) return;

    // Якщо колесо обертається, не оновлюємо сектор
    if (isSpinning) {
      console.log('Wheel is still spinning, skipping SVG pointer update');
      return;
    }
    
    console.log(`setVisibleSectorBySVGPointer called with wheelRotation=${incomingRotation}`);
    
    // Завжди використовуємо збережену ротацію для визначення сектора
    const effectiveRotation = wheelState.currentRotation;
    console.log(`Using effective rotation ${effectiveRotation}° from storage`);
    
    // Використовуємо функцію для визначення сектора під вказівником
    const sectorIndex = getSectorUnderPointer(teamMembers, effectiveRotation);
    
    // Перевіряємо, чи сектор змінився
    if (sectorIndex !== visibleSectorIndex) {
      console.log(`Setting visible sector to #${sectorIndex}: ${teamMembers[sectorIndex].name}`);
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
}