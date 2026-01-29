import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
`;

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0c2461 0%, #1e3799 50%, #4a69bd 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(30, 136, 229, 0.1) 0%, transparent 50%)
          `,
          animation: `${pulse} 8s ease-in-out infinite`,
        }
      }}
    >
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            background: `rgba(255, 255, 255, ${0.02 + i * 0.01})`,
            borderRadius: '50%',
            animation: `${float} ${15 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
            width: `${50 + i * 10}px`,
            height: `${50 + i * 10}px`,
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedBackground;