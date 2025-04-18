import React from 'react';
import { WheelItem } from '../../../types';
import { COLORS } from '../../../constants/styleConfig';

/**
 * Props for rendering a single sector in the inner wheel
 */
interface ItemSectorProps {
  item: WheelItem;
  index: number;
  path: string;
  textPosition: { x: number; y: number; rotation: number };
}

/**
 * Component for rendering a single item sector in the inner wheel
 */
const ItemSector: React.FC<ItemSectorProps> = ({
  item,
  index,
  path,
  textPosition,
}) => {
  // Get color from palette based on sector index
  const colorIndex = index % COLORS.WHEEL_PALETTE.length;
  const sectorColor = item.color || COLORS.WHEEL_PALETTE[colorIndex];

  return (
    <g>
      <path
        d={path}
        fill={sectorColor}
        stroke={COLORS.STROKE}
        strokeWidth={COLORS.STROKE_WIDTH}
      />
      <g transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}>
        <text
          x={textPosition.x}
          y={textPosition.y}
          fontSize={14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={COLORS.TEXT}
        >
          {item.name}
        </text>
      </g>
    </g>
  );
};

export default React.memo(ItemSector);
