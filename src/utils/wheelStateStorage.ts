// Unified wheel state storage utility
// Handles saving and loading wheel UI state (rotation, selected sector, etc.) from localStorage

export interface WheelStateStorage {
  currentRotation: number;
  isFirstRender: boolean;
  selectedSector: number | null;
  selectedItem: import('../types').WheelItem | null;
}

// Returns the storage key for a given wheelId
function getRotationKey(wheelId: string) {
  return `wheelRotation_${wheelId}`;
}

export function getStoredRotation(wheelId: string): number | null {
  try {
    const stored = localStorage.getItem(getRotationKey(wheelId));
    if (!stored) return null;
    const rotation = parseFloat(stored);
    return isNaN(rotation) ? null : rotation;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function storeRotation(wheelId: string, rotation: number): void {
  try {
    if (rotation !== 0) {
      localStorage.setItem(getRotationKey(wheelId), rotation.toString());
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// You can add more state (selectedSector, selectedItem) as needed
