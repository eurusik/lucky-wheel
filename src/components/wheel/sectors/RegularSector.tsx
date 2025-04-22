import React from 'react';
import { SectorProps } from './types';
import { COLORS, SIZES } from '../../../constants/styleConfig';
import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Regular sector component with configurable color and optional immunity star
 */
const RegularSector: React.FC<SectorProps> = ({ path, color = 'transparent', hasImmunity = false, textPosition }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const strokeWidth = isMobile
    ? SIZES.STROKE_WIDTH.mobile
    : isTablet
    ? SIZES.STROKE_WIDTH.tablet
    : SIZES.STROKE_WIDTH.desktop;
  const fontSize = isMobile
    ? SIZES.FONT_SIZE.mobile
    : isTablet
    ? SIZES.FONT_SIZE.tablet
    : SIZES.FONT_SIZE.desktop;

  return (
    <>
      <path
        d={path}
        fill={color}
        stroke={COLORS.STROKE}
        strokeWidth={strokeWidth}
      />
      {hasImmunity && textPosition && (
        <g transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}>
          <text
            x={textPosition.x}
            y={textPosition.y}
            fontSize={fontSize}
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

export default React.memo(RegularSector);
