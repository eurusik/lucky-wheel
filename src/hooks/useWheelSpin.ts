import { useState, useCallback, useEffect } from 'react';
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
  const pointerAngle = 270;
  const angleUnderPointer = (pointerAngle - wheelRotation + 360) % 360;
  const sectorIndex = Math.floor(angleUnderPointer / degreesPerSector) % N;
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
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [visibleSectorIndex, setVisibleSectorIndex] = useState<number | null>(null);
  const { spinDuration } = { ...DEFAULT_WHEEL_CONFIG, ...config };

  /**
   * Spins the wheel to a random available sector (skipping immune sectors).
   */
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Check if all sectors have immunity
    const allImmune = teamMembers.every((_, idx) => immunityService.hasSectorImmunity(idx));
    if (allImmune) {
      setIsSpinning(false);
      alert('All sectors have immunity!');
      return;
    }

    const sectorAngle = 360 / teamMembers.length;
    let randomSectorIndex = Math.floor(Math.random() * teamMembers.length);
    const availableSectorIndex = findNextAvailableSector(teamMembers, randomSectorIndex);
    if (availableSectorIndex === null) {
      setIsSpinning(false);
      alert('All sectors have immunity!');
      return;
    }
    randomSectorIndex = availableSectorIndex;

    // The pointer is at 270° (top); align the chosen sector to this point
    const pointerAngle = 270;
    const targetAngle = pointerAngle - (randomSectorIndex * sectorAngle + sectorAngle / 2);
    const randomSpins = Math.floor(Math.random() * 3) + 3;
    const targetAngleNorm = (targetAngle + 360) % 360;
    const finalRotation = randomSpins * 360 + targetAngleNorm;
    setWheelRotation(finalRotation);
    setTimeout(() => {
      setIsSpinning(false);
      const displayRotation = finalRotation % 360;
      setWheelRotation(displayRotation);
      const underPointer = getSectorUnderPointer(teamMembers, displayRotation);
      setVisibleSectorIndex(underPointer);
      setSelectedTeamMember(teamMembers[underPointer]);
      onSpinComplete();
    }, spinDuration + 100);
  }, [isSpinning, teamMembers, spinDuration, onSpinComplete]);

  /**
   * Synchronize visibleSectorIndex with wheelRotation after the wheel stops.
   */
  useEffect(() => {
    if (!isSpinning) {
      const idx = getSectorUnderPointer(teamMembers, wheelRotation);
      setVisibleSectorIndex(idx);
    }
  }, [wheelRotation, isSpinning, teamMembers]);

  /**
   * Adds immunity to the sector currently under the pointer.
   */
  const addImmunityToSelectedSector = useCallback(() => {
    if (visibleSectorIndex !== null) {
      const memberName = teamMembers[visibleSectorIndex].name;
      immunityService.addImmunity(visibleSectorIndex, memberName);
      window.dispatchEvent(new Event('immunityChanged'));
    }
  }, [visibleSectorIndex, teamMembers]);

  /**
   * Setter for visible sector index (used for hit-testing).
   */
  const setVisibleSectorIndexByPointer = (sectorIndex: number) => {
    setVisibleSectorIndex(sectorIndex);
  };

  /**
   * Hit-testing logic to determine which sector is under the pointer (SVG version).
   * Should be called from the UI with svg ref, outerRadius, and wheelRotation.
   */
  const setVisibleSectorBySVGPointer = (
    svg: SVGSVGElement | null,
    outerRadius: number,
    wheelRotation: number
  ) => {
    if (!svg) return;
    const cx = outerRadius;
    const cy = outerRadius;
    const r = outerRadius;
    // Pointer at 270° (top) minus current rotation
    const angleDeg = 270 - wheelRotation;
    const angleRad = (angleDeg * Math.PI) / 180;
    const point = svg.createSVGPoint();
    point.x = cx + r * Math.cos(angleRad);
    point.y = cy + r * Math.sin(angleRad);
    const paths = svg.querySelectorAll('path[data-sector-index]');
    for (const path of Array.from(paths)) {
      // @ts-expect-error: isPointInFill is not typed for SVGPathElement in TypeScript, but is available in modern browsers
      if (typeof path.isPointInFill === 'function' && path.isPointInFill(point)) {
        const sectorIndex = parseInt(path.getAttribute('data-sector-index') || '', 10);
        if (!isNaN(sectorIndex)) {
          setVisibleSectorIndex(sectorIndex);
        }
        break;
      }
    }
  };

  return {
    isSpinning,
    wheelRotation,
    spinWheel,
    selectedTeamMember,
    visibleSectorIndex,
    addImmunityToSelectedSector,
    setVisibleSectorIndexByPointer,
    setVisibleSectorBySVGPointer,
  };
}