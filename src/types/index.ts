export interface TeamMember {
  id: string;
  name: string;
  color: string;
}

export interface SpinStats {
  count: number;
  lastSpinTime: string | null;
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
