export interface WheelItem {
  id: string;
  name: string;
  isImmune?: boolean;
  color?: string;
}

export type TeamMember = WheelItem;

export interface SpinStats {
  count: number;
  lastSpinTime: string;
}

/**
 * Sector immunity information
 */
export interface SectorImmunity {
  sectorIndex: number;  // Sector index
  name: string;         // Sector name
  createdAt: string;    // Immunity creation date
}

export interface WheelConfig {
  innerRadius: number;
  outerRadius: number;
  spins: number;
  spinDuration: number;
}

export interface Wheel {
  id: string;          // Unique hash/id for the wheel
  name: string;        // Wheel name
  items: WheelItem[];  // Items in the wheel
  createdAt: string;   // Creation timestamp
  updatedAt: string;   // Last update timestamp
}

// Response when creating a new wheel
export interface CreateWheelResponse {
  wheel: Wheel;
  accessHash: string;  // Hash for accessing/managing the wheel
}
