import React from 'react';
import { ANIMATION } from '../../constants/styleConfig';
import WheelSector from './sectors/WheelSector';

/**
 * Props for the OuterWheel component
 */
interface OuterWheelProps {
  rotation: number;
  isSpinning: boolean;
  innerRadius: number;
  outerRadius: number;
  itemsCount: number;
  wheelId: string;
}

/**
 * Main component for the outer wheel that contains all sectors
 */
const OuterWheel: React.FC<OuterWheelProps> = ({
  rotation,
  isSpinning,
  innerRadius,
  outerRadius,
  itemsCount,
  wheelId
}) => {
  const center = outerRadius;
  // Use the same number of sectors as items
  const degreesPerSector = 360 / itemsCount;
  const rotationStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning
      ? ANIMATION.WHEEL_TRANSITION
      : 'none',
    transformOrigin: 'center',
  };

  return (
    <g style={rotationStyle}>
      {Array.from({ length: itemsCount }).map((_, index) => (
        <WheelSector
          key={index}
          sectorIndex={index}
          wheelCenterPoint={center}
          sectorInnerRadius={innerRadius}
          sectorOuterRadius={outerRadius}
          sectorAngle={degreesPerSector}
          wheelId={wheelId}
        />
      ))}
    </g>
  );
};

export default OuterWheel;
