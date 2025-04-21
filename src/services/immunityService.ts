import { SectorImmunity } from '../types';
import * as immunityDataProvider from '../utils/immunityDataProvider';

/**
 * Service for working with sector immunities (unified for Firestore/localStorage)
 */
export const immunityService = {
  /**
   * Get all immunities for a wheel
   */
  async getImmunities(wheelId: string): Promise<SectorImmunity[]> {
    return immunityDataProvider.getImmunities(wheelId);
  },

  /**
   * Add immunity for a sector
   */
  async addImmunity(wheelId: string, sectorIndex: number, name: string): Promise<SectorImmunity> {
    return immunityDataProvider.addImmunity(wheelId, sectorIndex, name);
  },

  /**
   * Remove immunity for a sector
   */
  async removeImmunity(wheelId: string, sectorIndex: number): Promise<boolean> {
    return immunityDataProvider.removeImmunity(wheelId, sectorIndex);
  },

  /**
   * Check if a sector has immunity
   */
  async hasSectorImmunity(wheelId: string, sectorIndex: number): Promise<boolean> {
    return immunityDataProvider.hasSectorImmunity(wheelId, sectorIndex);
  },

  /**
   * Get immunity for a sector
   */
  async getSectorImmunity(wheelId: string, sectorIndex: number): Promise<SectorImmunity | null> {
    return immunityDataProvider.getSectorImmunity(wheelId, sectorIndex);
  },

  /**
   * Clear all immunities
   */
  async clearAllImmunities(wheelId: string): Promise<void> {
    return immunityDataProvider.clearAllImmunities(wheelId);
  }
};
