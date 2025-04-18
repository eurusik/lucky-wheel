import React from 'react';
import { OUTER_SECTORS_COUNT } from '../../constants/wheelConfig';
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
}

/**
 * Main component for the outer wheel that contains all sectors
 */
const OuterWheel: React.FC<OuterWheelProps> = ({
  rotation,
  isSpinning,
  innerRadius,
  outerRadius,
}) => {
  const center = outerRadius;
  const degreesPerSector = 360 / OUTER_SECTORS_COUNT;
  const rotationStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning
      ? ANIMATION.OUTER_WHEEL_TRANSITION
      : 'none',
    transformOrigin: 'center',
  };

  return (
    <g style={rotationStyle}>
      {Array.from({ length: OUTER_SECTORS_COUNT }).map((_, index) => (
        <WheelSector
          key={index}
          sectorIndex={index}
          wheelCenterPoint={center}
          sectorInnerRadius={innerRadius}
          sectorOuterRadius={outerRadius}
          sectorAngle={degreesPerSector}
        />
      ))}
    </g>
  );
};

export default OuterWheel;
