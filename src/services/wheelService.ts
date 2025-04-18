import { Wheel, WheelItem, CreateWheelResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from './storageService';

/**
 * Service for managing wheels
 */
export const wheelService = {
  /**
   * Create a new wheel
   */
  createWheel(name: string, items: WheelItem[] = []): CreateWheelResponse {
    const wheelId = uuidv4();
    const accessHash = uuidv4();
    
    const wheel: Wheel = {
      id: wheelId,
      name,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.createWheelData(wheel, accessHash);
    return { wheel, accessHash };
  },

  /**
   * Get wheel by ID
   */
  getWheel(wheelId: string): Wheel | null {
    const data = storageService.getWheelData(wheelId);
    return data?.wheel || null;
  },

  /**
   * Update wheel data
   */
  updateWheel(wheelId: string, updates: Partial<Wheel>, accessHash: string): boolean {
    if (!storageService.verifyAccessHash(wheelId, accessHash)) {
      return false;
    }

    const data = storageService.getWheelData(wheelId);
    if (!data) {
      return false;
    }

    const updatedWheel = {
      ...data.wheel,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveWheelData(wheelId, { wheel: updatedWheel });
    return true;
  },

  /**
   * Delete wheel
   */
  deleteWheel(wheelId: string, accessHash: string): boolean {
    if (!storageService.verifyAccessHash(wheelId, accessHash)) {
      return false;
    }

    const data = storageService.getWheelData(wheelId);
    if (!data) {
      return false;
    }

    storageService.deleteWheelData(wheelId);
    return true;
  },

  /**
   * Get all wheels
   */
  getAllWheels(): { [wheelId: string]: Wheel } {
    const data = storageService.getAllData();
    const wheels: { [wheelId: string]: Wheel } = {};
    
    Object.entries(data).forEach(([wheelId, wheelData]) => {
      wheels[wheelId] = wheelData.wheel;
    });
    
    return wheels;
  }
}; 