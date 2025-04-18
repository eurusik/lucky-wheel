/**
 * Props for sector components
 */
export interface SectorProps {
  path: string;          // SVG path for the sector
  color?: string;        // Color for the sector (optional)
  hasImmunity?: boolean; // Whether the sector has immunity
  sectorIndex?: number;  // Index of the sector
  textPosition?: {       // Position for text (optional)
    x: number;
    y: number;
    rotation: number;
  };
}
