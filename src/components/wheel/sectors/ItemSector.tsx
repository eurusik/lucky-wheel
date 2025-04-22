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
  radius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Component for rendering a single item sector in the inner wheel
 */
const ItemSector: React.FC<ItemSectorProps> = ({
  item,
  index,
  path,
  textPosition,
  radius,
  startAngle,
  endAngle
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
        {(() => {
          // Calculate max text width for this sector
          const maxTextWidth = Math.max(32, 2 * 0.78 * 0.92 * radius * Math.sin((endAngle - startAngle) / 2)); // 92% of chord length
          let displayName = item.name;
          let fontSize = 14;
          // Try to fit text, reduce font size if needed
          if (item.name.length > 16) displayName = item.name.slice(0, 14) + '…';
          if (displayName.length > 12) fontSize = 13;
          if (displayName.length > 15) fontSize = 12;
          if (displayName.length > 18) fontSize = 11;
          if (displayName.length > 22) fontSize = 10;

          // Estimate actual text width in px (very rough, but enough for our case)
          const approxCharWidth = fontSize * 0.6; // average width per char
          const actualTextWidth = displayName.length * approxCharWidth;
          const needsCompression = actualTextWidth > maxTextWidth;

          if (needsCompression) {
            return (
              <text
                x={textPosition.x}
                y={textPosition.y}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={COLORS.TEXT}
                style={{ pointerEvents: 'auto', cursor: item.name.length > 16 ? 'pointer' : 'default' }}
                textLength={maxTextWidth}
                lengthAdjust="spacingAndGlyphs"
              >
                <title>{item.name}</title>
                {displayName}
              </text>
            );
          } else {
            return (
              <text
                x={textPosition.x}
                y={textPosition.y}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={COLORS.TEXT}
                style={{ pointerEvents: 'auto', cursor: item.name.length > 16 ? 'pointer' : 'default' }}
              >
                <title>{item.name}</title>
                {displayName}
              </text>
            );
          }
        })()}

      </g>
    </g>
  );
};

export default React.memo(ItemSector);
