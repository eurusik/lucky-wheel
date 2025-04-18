import React from 'react';
import { TeamMember } from '../../types';
import { getTeamMemberSectorPath } from '../../utils/wheelGeometry';
import TeamMemberSector from './sectors/TeamMemberSector';
import { ANIMATION } from '../../constants/styleConfig';

interface InnerWheelProps {
  teamMembers: TeamMember[];
  rotation: number;
  isSpinning: boolean;
  radius: number;
}

const InnerWheel: React.FC<InnerWheelProps> = ({
  teamMembers,
  rotation,
  isSpinning,
  radius,
}) => {
  const center = radius + 20;
  const degreesPerMember = 360 / teamMembers.length;

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
      {teamMembers.map((member, index) => {
        // Calculate angles for this sector (in radians)
        const startAngle = (degreesPerMember * index * Math.PI) / 180;
        const endAngle = (degreesPerMember * (index + 1) * Math.PI) / 180;
        
        // Get the path and text position from our utility function
        const { path, textPosition } = getTeamMemberSectorPath({
          center,
          radius,
          startAngle,
          endAngle
        });

        return (
          <TeamMemberSector
            key={member.id}
            member={member}
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
