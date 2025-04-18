/**
 * Types for wheel components
 */

// Common props for sector components
export interface SectorProps {
  path: string;          // SVG path for the sector
  textPosition?: {       // Position for text (optional)
    x: number;
    y: number;
    rotation: number;
  };
}

// Props for a sector in the wheel
export interface WheelSectorProps {
  index: number;         // Index of the sector
  center: number;        // Center point of the wheel
  innerRadius: number;   // Inner radius of the ring
  outerRadius: number;   // Outer radius of the ring
  degreesPerSector: number; // How many degrees each sector takes
}

// Props for the OuterWheel component
export interface OuterWheelProps {
  rotation: number;      // Current rotation angle in degrees
  isSpinning: boolean;   // Whether the wheel is currently spinning
  innerRadius: number;   // Inner radius of the ring
  outerRadius: number;   // Outer radius of the ring
}
