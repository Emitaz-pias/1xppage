import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Fade,
  Slide
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// New shimmer animation
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const HeroSection = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.9) 0%, rgba(40, 53, 147, 0.9) 50%, rgba(48, 63, 159, 0.9) 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #ff6b35, transparent)',
    animation: `${shimmer} 3s infinite linear`,
  }
}));

const GlowCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: `1px solid rgba(255, 255, 255, 0.2)`,
  borderRadius: theme.spacing(2),
  boxShadow: `
    0 8px 32px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05)
  `,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `
      0 20px 40px rgba(0,0,0,0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  fontSize: '1.1rem',
  borderRadius: theme.spacing(2),
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const AgentPromo = ({ onAgentClick }) => {
  const theme = useTheme();

  const becomeAgentItems = [
    "Workers with Us",
    "Solutions", 
    "Contacts",
    "Cookie Policy",
    "BECOME AN AGENT"
  ];

  const howItWorksItems = [
    "Workers with Us",
    "Workers with Us", 
    "Workers with Us"
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated Background */}
      
      {/* Hero Section */}
      <HeroSection elevation={0}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #fff, #ffd700)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 30px rgba(255,215,0,0.3)'
              }}
            >
              Make money with 1xBet
            </Typography>
          </Fade>
          
          <Fade in timeout={1200}>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                marginBottom: 4,
                opacity: 0.9,
                lineHeight: 1.6,
                fontWeight: 300
              }}
            >
              Join the agent program of 1xBet — the world leader in the betting industry — and get a new source of income.
            </Typography>
          </Fade>

          <Fade in timeout={1400}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <StyledButton 
                variant="contained" 
                size="large"
                onClick={onAgentClick}
                sx={{
                  background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                  minWidth: '240px',
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #e55a2b, #ff6b35)',
                    boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)',
                  }
                }}
              >
                BECOME AN AGENT
              </StyledButton>
              
              <StyledButton 
                variant="outlined" 
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  minWidth: '240px',
                  borderWidth: '2px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: '#ffd700',
                    color: '#ffd700'
                  }
                }}
              >
                HOW DOES IT WORK?
              </StyledButton>
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      {/* Two Columns Section */}
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Left Column - BECOME AN AGENT */}
          <Grid item xs={12} md={6}>
            <Slide in direction="right" timeout={800}>
              <GlowCard>
                <Typography 
                  variant="h3" 
                  component="h2"
                  gutterBottom
                  sx={{ 
                    background: 'linear-gradient(45deg, #1e88e5, #0d47a1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 3
                  }}
                >
                  BECOME AN AGENT
                </Typography>
                
                <Divider sx={{ mb: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                
                <List>
                  {becomeAgentItems.map((item, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        py: 2,
                        borderLeft: item === "BECOME AN AGENT" ? `4px solid ${theme.palette.primary.main}` : 'none',
                        backgroundColor: item === "BECOME AN AGENT" ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                        borderRadius: 1,
                        marginBottom: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          transform: 'translateX(8px)'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                          fontWeight: item === "BECOME AN AGENT" ? 'bold' : 'medium',
                          color: item === "BECOME AN AGENT" ? 'primary.main' : 'text.primary',
                          fontSize: '1.1rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </GlowCard>
            </Slide>
          </Grid>

          {/* Right Column - HOW DOES IT WORK? */}
          <Grid item xs={12} md={6}>
            <Slide in direction="left" timeout={800}>
              <GlowCard>
                <Typography 
                  variant="h3" 
                  component="h2"
                  gutterBottom
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff6b35, #e55a2b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 3
                  }}
                >
                  HOW DOES IT WORK?
                </Typography>
                
                <Divider sx={{ mb: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                
                <List>
                  {howItWorksItems.map((item, index) => (
                    <ListItem key={index} sx={{ py: 2, marginBottom: 1 }}>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                          fontWeight: 'medium',
                          fontSize: '1.1rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <StyledButton 
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
                      minWidth: '200px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e55a2b, #ff6b35)',
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
                      }
                    }}
                  >
                    Learn More
                  </StyledButton>
                </Box>
              </GlowCard>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AgentPromo;