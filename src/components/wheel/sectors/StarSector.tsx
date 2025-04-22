import React from 'react';
import { SectorProps } from './types';
import { COLORS, SIZES } from '../../../constants/styleConfig';
import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Star sector component (special sector with star symbol)
 */
const StarSector: React.FC<SectorProps> = ({ path, textPosition }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const strokeWidth = isMobile
    ? SIZES.STROKE_WIDTH.mobile
    : isTablet
    ? SIZES.STROKE_WIDTH.tablet
    : SIZES.STROKE_WIDTH.desktop;
  const fontSize = isMobile
    ? SIZES.FONT_SIZE.mobile * 1.2
    : isTablet
    ? SIZES.FONT_SIZE.tablet * 1.2
    : SIZES.FONT_SIZE.desktop * 1.2;

  return (
    <>
      <path
        d={path}
        fill={COLORS.STAR_BACKGROUND}
        stroke={COLORS.STROKE}
        strokeWidth={strokeWidth}
      />
      {textPosition && (
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

export default React.memo(StarSector);
