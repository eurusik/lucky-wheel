import React from 'react';
import { keyframes } from '@mui/system';
import { Box } from '@mui/material';

// Define keyframes for confetti explosion
const confettiExplosion = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) rotate(var(--tr));
    opacity: 0;
  }
`;

interface ConfettiAnimationProps {
  count?: number;
  size?: number;
  duration?: number;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  count = 50,
  size = 8,
  duration = 2
}) => {
  // Generate random confetti pieces
  const confetti = Array.from({ length: count }, (_, i) => {
    // Random angle for explosion (in radians)
    const angle = Math.random() * Math.PI * 2;
    // Random distance for explosion
    const distance = 50 + Math.random() * 100;
    // Calculate x and y components
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    // Random rotation
    const tr = Math.random() * 720 - 360;
    // Random color
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    // Random shape (square, rectangle, or circle)
    const shape = Math.random() > 0.5 ? 'square' : 'circle';
    
    return {
      id: i,
      tx: `${tx}px`,
      ty: `${ty}px`,
      tr: `${tr}deg`,
      color,
      shape,
      delay: `${Math.random() * 0.2}s`,
      duration: `${duration + Math.random() * 0.5}s`
    };
  });

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
      {confetti.map((piece) => (
        <Box
          key={piece.id}
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: piece.shape === 'square' ? size : size * 1.5,
            height: piece.shape === 'square' ? size : size * 0.5,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : 0,
            '--tx': piece.tx,
            '--ty': piece.ty,
            '--tr': piece.tr,
            animation: `${confettiExplosion} ${piece.duration} ${piece.delay} forwards`,
            transformOrigin: 'center'
          }}
        />
      ))}
    </Box>
  );
};

export default ConfettiAnimation; 