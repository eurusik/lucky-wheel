export interface WheelItem {
  id: string;
  name: string;
  isImmune?: boolean;
  color?: string;
  createdAt?: string; // ISO string timestamp of item creation
}

export type TeamMember = WheelItem;

export interface SpinStats {
  count: number;
  lastSpinTime: string | null;
}

export interface FirestoreWheelData {
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
  lastRotation?: number;
  createdAt?: number; // Timestamp of wheel creation
}

export interface StoredWheelData {
  id: string;
  name: string;
  items: WheelItem[];
  spinStats: SpinStats;
  lastRotation?: number;
  createdAt?: number; // Timestamp of wheel creation
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
