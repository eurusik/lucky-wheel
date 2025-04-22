/**
 * Utility functions for wheel geometry calculations
 */

/**
 * Parameters for calculating a sector path
 */
export interface SectorPathParams {
  center: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Result of the sector path calculation
 */
export interface SectorPathResult {
  path: string;
  textPosition: {
    x: number;
    y: number;
    rotation: number;
  };
}

/**
 * Calculates the SVG path for a sector and the position for text
 */
export function getSectorPathAndTextPosition({
  center,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle
}: SectorPathParams): SectorPathResult {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const outerStartX = center + outerRadius * Math.cos(startRad);
  const outerStartY = center + outerRadius * Math.sin(startRad);
  const outerEndX = center + outerRadius * Math.cos(endRad);
  const outerEndY = center + outerRadius * Math.sin(endRad);
  
  const innerStartX = center + innerRadius * Math.cos(startRad);
  const innerStartY = center + innerRadius * Math.sin(startRad);
  const innerEndX = center + innerRadius * Math.cos(endRad);
  const innerEndY = center + innerRadius * Math.sin(endRad);
  const path = [
    `M ${innerStartX},${innerStartY}`,
    `L ${outerStartX},${outerStartY}`,
    `A ${outerRadius},${outerRadius} 0 0,1 ${outerEndX},${outerEndY}`,
    `L ${innerEndX},${innerEndY}`,
    `A ${innerRadius},${innerRadius} 0 0,0 ${innerStartX},${innerStartY}`,
    'Z'
  ].join(' ');
  
  const midAngle = (startAngle + endAngle) / 2;
  const midRad = (midAngle * Math.PI) / 180;
  const textRadius = (innerRadius + outerRadius) / 2;
  
  return {
    path,
    textPosition: {
      x: center + textRadius * Math.cos(midRad),
      y: center + textRadius * Math.sin(midRad),
      rotation: midAngle + 90
    }
  };
}

/**
 * Parameters for calculating an item sector path
 */
export interface ItemSectorParams {
  center: number;
  radius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Result of the item sector path calculation
 */
export interface ItemSectorResult {
  path: string;
  textPosition: {
    x: number;
    y: number;
    rotation: number;
  };
}

/**
 * Calculates the SVG path for an item sector and the position for text
 */
export function getItemSectorPath({
  center,
  radius,
  startAngle,
  endAngle
}: ItemSectorParams): ItemSectorResult {
  const startX = center + radius * Math.cos(startAngle);
  const startY = center + radius * Math.sin(startAngle);
  const endX = center + radius * Math.cos(endAngle);
  const endY = center + radius * Math.sin(endAngle);
  
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
  const path = [
    `M ${center},${center}`,
    `L ${startX},${startY}`,
    `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
    'Z'
  ].join(' ');
  
  const midAngle = (startAngle + endAngle) / 2;
  const textRadius = radius * 0.78; // Increased from 0.65 to 0.78 to raise the label position
  
  return {
    path,
    textPosition: {
      x: center + textRadius * Math.cos(midAngle),
      y: center + textRadius * Math.sin(midAngle),
      rotation: (midAngle * 180) / Math.PI + 90
    }
  };
}

/**
 * Calculate optimal number of sectors based on number of items
 * Maximum number of sectors is limited to 10
 */
export function calculateOptimalSectors(itemCount: number): number {
  if (itemCount <= 0) return 0;
  
  // Maximum limit of 10 sectors
  if (itemCount > 10) return 10;
  
  // For small numbers, use the same number of sectors as items
  if (itemCount <= 6) return itemCount;
  
  // For medium numbers (7-10), round up to nearest even number
  return Math.ceil(itemCount / 2) * 2;
}
