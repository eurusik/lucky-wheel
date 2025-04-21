import React from 'react';
import { WheelItem } from '../../types';

import ItemSector from './sectors/ItemSector';
import { ANIMATION } from '../../constants/styleConfig';

interface InnerWheelProps {
  items: WheelItem[];
  rotation: number;
  isSpinning: boolean;
  radius: number;
  center: number;
}

import { getItemSectorPath } from '../../utils/wheelGeometry';

const InnerWheel: React.FC<InnerWheelProps> = ({
  items,
  rotation,
  isSpinning,
  radius,
  center,
}) => {
  const degreesPerItem = 360 / items.length;

  return (
    <g
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning
          ? ANIMATION.WHEEL_TRANSITION
          : 'none',
        transformOrigin: 'center',
      }}
    >
      {items.map((item, index) => {
        // Calculate angles for this sector (in radians)
        const startAngle = (degreesPerItem * index * Math.PI) / 180;
        const endAngle = (degreesPerItem * (index + 1) * Math.PI) / 180;
        const { path, textPosition } = getItemSectorPath({
          center,
          radius,
          startAngle,
          endAngle
        });

        return (
          <ItemSector
            key={item.id}
            item={item}
            index={index}
            path={path}
            textPosition={textPosition}
          />
        );
      })}
    </g>
  );
};

export default InnerWheel;
