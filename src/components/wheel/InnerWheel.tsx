import React from 'react';
import { WheelItem } from '../../types';
import { getItemSectorPath } from '../../utils/wheelGeometry';
import ItemSector from './sectors/ItemSector';
import { ANIMATION } from '../../constants/styleConfig';

interface InnerWheelProps {
  items: WheelItem[];
  rotation: number;
  isSpinning: boolean;
  radius: number;
}

const InnerWheel: React.FC<InnerWheelProps> = ({
  items,
  rotation,
  isSpinning,
  radius,
}) => {
  const center = radius + 20;
  const degreesPerItem = 360 / items.length;

  return (
    <g
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning
          ? ANIMATION.INNER_WHEEL_TRANSITION
          : 'none',
        transformOrigin: 'center',
      }}
    >
      {items.map((item, index) => {
        // Calculate angles for this sector (in radians)
        const startAngle = (degreesPerItem * index * Math.PI) / 180;
        const endAngle = (degreesPerItem * (index + 1) * Math.PI) / 180;
        
        // Get the path and text position from our utility function
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
