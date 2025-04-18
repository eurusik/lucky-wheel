import { SectorImmunity } from '../types';
import { storageService } from './storageService';

/**
 * Service for working with sector immunities
 */
export const immunityService = {
  /**
   * Get all immunities for a wheel
   */
  getImmunities(wheelId: string): SectorImmunity[] {
    const data = storageService.getWheelData(wheelId);
    return data?.immunities || [];
  },

  /**
   * Add immunity for a sector
   */
  addImmunity(wheelId: string, sectorIndex: number, name: string): SectorImmunity {
    const newImmunity: SectorImmunity = {
      sectorIndex,
      name,
      createdAt: new Date().toISOString(),
    };
    
    storageService.addImmunity(wheelId, newImmunity);
    return newImmunity;
  },

  /**
   * Remove immunity for a sector
   */
  removeImmunity(wheelId: string, sectorIndex: number): boolean {
    const data = storageService.getWheelData(wheelId);
    if (!data) return false;

    const hasImmunity = data.immunities.some(i => i.sectorIndex === sectorIndex);
    if (hasImmunity) {
      storageService.removeImmunity(wheelId, sectorIndex);
      return true;
    }
    return false;
  },

  /**
   * Check if a sector has immunity
   */
  hasSectorImmunity(wheelId: string, sectorIndex: number): boolean {
    const data = storageService.getWheelData(wheelId);
    return data?.immunities.some(i => i.sectorIndex === sectorIndex) || false;
  },

  /**
   * Clear all immunities for a wheel
   */
  clearAllImmunities(wheelId: string): void {
    storageService.clearImmunities(wheelId);
  }
};
