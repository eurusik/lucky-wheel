import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants/styleConfig';
import { getSectorPathAndTextPosition } from '../../../utils/wheelGeometry';
import { immunityService } from '../../../services/immunityService';

/**
 * Props for a sector in the wheel
 */
interface WheelSectorProps {
  sectorIndex: number;
  wheelCenterPoint: number;
  sectorInnerRadius: number;
  sectorOuterRadius: number;
  sectorAngle: number;
}

/**
 * A single sector of the outer wheel that decides which type to render
 */
interface WheelSectorProps {
  sectorIndex: number;
  wheelCenterPoint: number;
  sectorInnerRadius: number;
  sectorOuterRadius: number;
  sectorAngle: number;
  wheelId: string;
}

const WheelSector: React.FC<WheelSectorProps> = ({
  sectorIndex,
  wheelCenterPoint,
  sectorInnerRadius,
  sectorOuterRadius,
  sectorAngle,
  wheelId
}) => {
  const [hasImmunity, setHasImmunity] = useState(false);
  
  // Check if the sector has immunity
  useEffect(() => {
    const checkImmunity = async () => {
      setHasImmunity(await immunityService.hasSectorImmunity(wheelId, sectorIndex));
    };
    checkImmunity();
    // Function to update immunity state
    const handleImmunityChange = async () => {
      setHasImmunity(await immunityService.hasSectorImmunity(wheelId, sectorIndex));
    };
    
    // Subscribe to immunity changes
    window.addEventListener('immunityChanged', handleImmunityChange);
    window.addEventListener('storage', handleImmunityChange);
    
    return () => {
      window.removeEventListener('immunityChanged', handleImmunityChange);
      window.removeEventListener('storage', handleImmunityChange);
    };
  }, [sectorIndex, wheelId]);
  const startAngle = sectorIndex * sectorAngle;
  const endAngle = (sectorIndex + 1) * sectorAngle;
  
  const { path, textPosition } = getSectorPathAndTextPosition({
    center: wheelCenterPoint,
    innerRadius: sectorInnerRadius,
    outerRadius: sectorOuterRadius,
    startAngle,
    endAngle
  });
  
  // Get color from palette based on sector index
  const colorIndex = sectorIndex % COLORS.WHEEL_PALETTE.length;
  const sectorColor = COLORS.WHEEL_PALETTE[colorIndex];
  
  return (
    <g key={sectorIndex}>
      <path
        data-sector-index={sectorIndex}
        d={path}
        fill={sectorColor}
        stroke={COLORS.STROKE}
        strokeWidth={COLORS.STROKE_WIDTH}
        style={{
          transition: 'filter 0.2s, opacity 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0,0,0,0.18))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '';
          e.currentTarget.style.filter = '';
        }}
      />
      {hasImmunity && textPosition && (
        <g transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}>
          <text
            x={textPosition.x}
            y={textPosition.y}
            fontSize={16}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
          >
            🛡️
          </text>
        </g>
      )}
    </g>
  );
};

export default React.memo(WheelSector);
