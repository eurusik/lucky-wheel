import React from 'react';
import { TeamMember } from '../../../types';
import { COLORS, SIZES } from '../../../constants/styleConfig';

interface TeamMemberSectorProps {
  member: TeamMember;    // Team member data
  path: string;          // SVG path for the sector
  textPosition: {        // Position for the text
    x: number;
    y: number;
    rotation: number;    // Text rotation in degrees
  };
}

/**
 * Component for rendering a single team member sector in the inner wheel
 */
interface TeamMemberSectorProps {
  member: TeamMember;
  index: number;
  path: string;
  textPosition: { x: number; y: number; rotation: number };
}

const TeamMemberSector: React.FC<TeamMemberSectorProps> = ({
  member,
  index,
  path,
  textPosition
}) => {
  return (
    <g>
      <path
        d={path}
        data-sector-index={index}
        fill={member.color}
        stroke={COLORS.STROKE}
        strokeWidth={SIZES.STROKE_WIDTH}
      />
      <text
        x={textPosition.x}
        y={textPosition.y}
        fill={COLORS.TEXT}
        fontSize={SIZES.FONT_SIZE}
        fontWeight="bold"
        textAnchor="middle"
        transform={`rotate(${textPosition.rotation}, ${textPosition.x}, ${textPosition.y})`}
      >
        {member.name}
      </text>
    </g>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(TeamMemberSector);
