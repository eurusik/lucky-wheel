import React from 'react';
import { SectorProps } from './types';
import { COLORS, SIZES } from '../../../constants/styleConfig';

/**
 * Star sector component (special sector with star symbol)
 */
const StarSector: React.FC<SectorProps> = ({ path, textPosition }) => {
  return (
    <>
      <path
        d={path}
        fill={COLORS.STAR_BACKGROUND}
        stroke={COLORS.STROKE}
        strokeWidth={SIZES.STROKE_WIDTH}
      />
      {textPosition && (
        <g transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}>
          <text
            x={textPosition.x}
            y={textPosition.y}
            fontSize={SIZES.FONT_SIZE * 1.2}
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
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(StarSector);
