// Unified wheel state storage utility
// Handles saving and loading wheel UI state (rotation, selected sector, etc.) from localStorage

export interface WheelStateStorage {
  currentRotation: number;
  isFirstRender: boolean;
  selectedSector: number | null;
  selectedItem: import('../types').WheelItem | null;
}

const STATE_KEY = 'wheelRotation';

export function getStoredRotation(): number | null {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (!stored) return null;
    const rotation = parseFloat(stored);
    return isNaN(rotation) ? null : rotation;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function storeRotation(rotation: number): void {
  try {
    if (rotation !== 0) {
      localStorage.setItem(STATE_KEY, rotation.toString());
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// You can add more state (selectedSector, selectedItem) as needed
