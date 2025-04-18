import { SectorImmunity } from '../types';

const IMMUNITY_STORAGE_KEY = 'wheel_immunities';

/**
 * Service for working with sector immunities
 */
export const immunityService = {
  /**
   * Get all immunities from localStorage
   */
  getImmunities(): SectorImmunity[] {
    try {
      const stored = localStorage.getItem(IMMUNITY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting immunities from localStorage:', error);
      return [];
    }
  },

  /**
   * Add immunity for a sector
   */
  addImmunity(sectorIndex: number, name: string): SectorImmunity {
    const immunities = this.getImmunities();
    
    // Check if immunity already exists for this sector
    const existingIndex = immunities.findIndex(
      immunity => immunity.sectorIndex === sectorIndex
    );
    
    const newImmunity: SectorImmunity = {
      sectorIndex,
      name,
      createdAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      // Update existing immunity
      immunities[existingIndex] = newImmunity;
    } else {
      // Add new immunity
      immunities.push(newImmunity);
    }
    
    localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(immunities));
    return newImmunity;
  },

  /**
   * Remove immunity for a sector
   */
  removeImmunity(sectorIndex: number): boolean {
    const immunities = this.getImmunities();
    const initialLength = immunities.length;
    
    const filteredImmunities = immunities.filter(
      immunity => immunity.sectorIndex !== sectorIndex
    );
    
    if (filteredImmunities.length !== initialLength) {
      localStorage.setItem(IMMUNITY_STORAGE_KEY, JSON.stringify(filteredImmunities));
      return true;
    }
    
    return false;
  },

  /**
   * Check if a sector has immunity
   */
  hasSectorImmunity(sectorIndex: number): boolean {
    const immunities = this.getImmunities();
    return immunities.some(immunity => immunity.sectorIndex === sectorIndex);
  },

  /**
   * Get immunity for a sector
   */
  getSectorImmunity(sectorIndex: number): SectorImmunity | null {
    const immunities = this.getImmunities();
    return immunities.find(immunity => immunity.sectorIndex === sectorIndex) || null;
  },

  /**
   * Clear all immunities
   */
  clearAllImmunities(): void {
    localStorage.removeItem(IMMUNITY_STORAGE_KEY);
  }
};
