import { Wheel, WheelItem, SectorImmunity } from '../types';

interface WheelStorage {
  [wheelId: string]: {
    wheel: Wheel;
    rotation: number;
    spinDuration: number;
    immunities: SectorImmunity[];
    accessHash: string;
  };
}

const STORAGE_KEY = 'lucky_wheel_data';

export const storageService = {
  /**
   * Get all stored data
   */
  getAllData(): WheelStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  },

  /**
   * Get data for a specific wheel
   */
  getWheelData(wheelId: string) {
    const data = this.getAllData();
    return data[wheelId] || null;
  },

  /**
   * Save wheel data
   */
  saveWheelData(wheelId: string, wheelData: Partial<WheelStorage[string]>) {
    const data = this.getAllData();
    data[wheelId] = {
      ...data[wheelId],
      ...wheelData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Delete wheel data
   */
  deleteWheelData(wheelId: string) {
    const data = this.getAllData();
    delete data[wheelId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Create new wheel data
   */
  createWheelData(wheel: Wheel, accessHash: string) {
    const data = this.getAllData();
    data[wheel.id] = {
      wheel,
      rotation: 0,
      spinDuration: 5000,
      immunities: [],
      accessHash,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Update wheel rotation
   */
  updateRotation(wheelId: string, rotation: number) {
    const data = this.getAllData();
    if (data[wheelId]) {
      data[wheelId].rotation = rotation;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  /**
   * Update spin duration
   */
  updateSpinDuration(wheelId: string, duration: number) {
    const data = this.getAllData();
    if (data[wheelId]) {
      data[wheelId].spinDuration = duration;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  /**
   * Add immunity
   */
  addImmunity(wheelId: string, immunity: SectorImmunity) {
    const data = this.getAllData();
    if (data[wheelId]) {
      const existingIndex = data[wheelId].immunities.findIndex(
        i => i.sectorIndex === immunity.sectorIndex
      );
      
      if (existingIndex >= 0) {
        data[wheelId].immunities[existingIndex] = immunity;
      } else {
        data[wheelId].immunities.push(immunity);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  /**
   * Remove immunity
   */
  removeImmunity(wheelId: string, sectorIndex: number) {
    const data = this.getAllData();
    if (data[wheelId]) {
      data[wheelId].immunities = data[wheelId].immunities.filter(
        i => i.sectorIndex !== sectorIndex
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  /**
   * Clear all immunities for a wheel
   */
  clearImmunities(wheelId: string) {
    const data = this.getAllData();
    if (data[wheelId]) {
      data[wheelId].immunities = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  /**
   * Verify access hash
   */
  verifyAccessHash(wheelId: string, accessHash: string): boolean {
    const data = this.getAllData();
    return data[wheelId]?.accessHash === accessHash;
  }
}; 