import React from 'react';
import { keyframes } from '@mui/system';
import { Box } from '@mui/material';

// Define keyframes for candy animation
const candyFall = keyframes`
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%) rotate(360deg);
    opacity: 0;
  }
`;

// Define keyframes for candy swing
const candySwing = keyframes`
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(-10deg);
  }
`;

interface CandyAnimationProps {
  count?: number;
  size?: number;
  duration?: number;
}

const CandyAnimation: React.FC<CandyAnimationProps> = ({
  count = 10,
  size = 24,
  duration = 3
}) => {
  // Generate random positions for candies
  const candies = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${duration + Math.random() * 2}s`,
    size: size * (0.8 + Math.random() * 0.4)
  }));

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {candies.map((candy) => (
        <Box
          key={candy.id}
          sx={{
            position: 'absolute',
            left: candy.left,
            top: '-10%',
            fontSize: candy.size,
            animation: `${candyFall} ${candy.duration} ${candy.delay} infinite, ${candySwing} 2s ${candy.delay} infinite`,
            transformOrigin: 'center',
            '&::before': {
              content: '"🍬"',
              display: 'block'
            }
          }}
        />
      ))}
    </Box>
  );
};

export default CandyAnimation; 