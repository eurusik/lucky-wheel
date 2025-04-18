import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import WheelPointer from './WheelPointer';
import OuterWheel from './OuterWheel';
import InnerWheel from './InnerWheel';
import ImmunityButton from './ImmunityButton';
import { TeamMember } from '../../types';
import { SIZES, ANIMATION, BREAKPOINTS } from '../../constants/styleConfig';

interface WheelAreaProps {
  wheelRef: React.RefObject<SVGSVGElement | null>;
  innerRadius: number;
  outerRadius: number;
  wheelRotation: number;
  isSpinning: boolean;
  spinWheel: () => void;
  teamMembers: TeamMember[];
  selectedTeamMember: TeamMember | null;
  visibleSectorIndex: number | null;
  addImmunityToSelectedSector: () => void;
}

const WheelArea: React.FC<WheelAreaProps> = ({
  wheelRef,
  innerRadius,
  outerRadius,
  wheelRotation,
  isSpinning,
  spinWheel,
  teamMembers,
  selectedTeamMember,
  visibleSectorIndex,
  addImmunityToSelectedSector,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));
  const isTablet = useMediaQuery(theme.breakpoints.between(BREAKPOINTS.MOBILE, BREAKPOINTS.DESKTOP));
  
  const wheelSize = isMobile 
    ? SIZES.WHEEL_SIZE.mobile 
    : isTablet 
    ? SIZES.WHEEL_SIZE.tablet 
    : SIZES.WHEEL_SIZE.desktop;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        gap: 3,
        width: { xs: '100%', md: 'auto' },
        position: 'relative',
      }}
      data-wheel-container
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: -38,
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <WheelPointer isSpinning={isSpinning} />
      </Box>
      <svg
        ref={wheelRef}
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${outerRadius * 2} ${outerRadius * 2}`}
        onClick={spinWheel}
        style={{
          cursor: 'pointer',
          filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.15))',
          transition: 'transform 0.3s ease, filter 0.3s ease',
          borderRadius: '50%',
          backgroundColor: 'white',
          padding: 1,
        }}
      >
        <g
          className="wheel"
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: isSpinning ? ANIMATION.INNER_WHEEL_TRANSITION : 'none',
            transformOrigin: 'center',
          }}
        >
          <OuterWheel 
            rotation={0}
            isSpinning={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          />
          <InnerWheel 
            teamMembers={teamMembers}
            rotation={0}
            isSpinning={false}
            radius={innerRadius}
          />
        </g>
      </svg>
      {selectedTeamMember && visibleSectorIndex !== null && (
        <ImmunityButton 
          onClick={addImmunityToSelectedSector}
          isVisible={!isSpinning}
          selectedSectorName={teamMembers[visibleSectorIndex]?.name || ''}
        />
      )}
    </Box>
  );
};

export default WheelArea;
