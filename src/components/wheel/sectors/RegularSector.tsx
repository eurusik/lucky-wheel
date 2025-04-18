import React from 'react';
import { SectorProps } from './types';
import { COLORS, SIZES } from '../../../constants/styleConfig';

/**
 * Regular sector component with configurable color and optional immunity star
 */
const RegularSector: React.FC<SectorProps> = ({ path, color = 'transparent', hasImmunity = false, textPosition }) => (
  <>
    <path
      d={path}
      fill={color}
      stroke={COLORS.STROKE}
      strokeWidth={SIZES.STROKE_WIDTH}
    />
    {hasImmunity && textPosition && (
      <g transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}>
        <text
          x={textPosition.x}
          y={textPosition.y}
          fontSize={SIZES.FONT_SIZE}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000"
        >
          🛡️
        </text>
      </g>
    )}
  </>
);

export default React.memo(RegularSector);
