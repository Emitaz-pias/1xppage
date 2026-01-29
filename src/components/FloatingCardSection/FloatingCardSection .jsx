import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import ball1 from '../../images/join_us_ball_one_1x.png';
import ball2 from '../../images/join_us_ball_two_1x.png';
import cardPhone from '../../images/join_us_phone_1x.png';
// import cardOnly from '../../images/join_us_card_1x.png';
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const soccerBallMove = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(15px, -10px); }
  100% { transform: translate(0, 0); }
`;

const FloatingCardSection = ({ onAgentClick }) => {
  return (
    <Box
   
      sx={{
        bgcolor: '#8EDD5B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 6 },
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',      
      }}
    >
      {/* Left Content */}
      <Box sx={{ maxWidth: 400 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: '#0a2a66', mb: 2 }}
        >
          Join us and start making money today!
        </Typography>
        <Button
          variant="contained"
          onClick={onAgentClick}
          sx={{
            bgcolor: '#0a2a66',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: '#0c3a8a' },
          }}
        >
          BECOME AN AGENT
        </Button>
      </Box>

      {/* Right Floating Card */}
      <Box
        sx={{
          position: 'relative',
          mt: { xs: 4, md: 0 },
          animation: `${float} 3s ease-in-out infinite`,         
        }}
      >
        <Box
          component="img"
          src={cardPhone}// Place your phone & card image here
          alt="Card and phone"
          sx={{
            width: { xs: 250, md: 350 },
            height: 'auto',
          }}
        />
      </Box>

      {/* Animated Footballs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          animation: `${soccerBallMove} 2s ease-in-out infinite`,
        }}
      >
        <Box
          component="img"
          src={ball1} // Place your soccer ball image here
          alt="Football"
          sx={{
            width: 40,
            height: 'auto',
            position: 'absolute',
            top: '0',
            left: '0',
            animationDelay: '0s',
          }}
        />
        <Box
          component="img"
          src={ball2} // Place your soccer ball image here
          alt="Football"
          sx={{
            width: 40,
            height: 'auto',
            position: 'absolute',
            bottom: '10%',
            right: '0',
            animationDelay: '0.5s',
          }}
        />
      </Box>
    </Box>
  );
};

export default FloatingCardSection;
