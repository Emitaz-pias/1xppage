import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
// Import-gulo thik kora holo
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- Scrolling Ticker Animation ---
// Marquee animation keyframes
// --- Scrolling Ticker Animation ---
const tickerAnimation = {
  '@keyframes ticker': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-50%)' }, // move half because text is repeated
  },
};


// Ticker text content
const tickerText =
  '12 YEARS OF EXPERIENCE • 50,000+ AGENTS • 40+ COUNTRIES • BIG PAYOUTS •12 YEARS OF EXPERIENCE • 50,000+ AGENTS • 40+ COUNTRIES • BIG PAYOUTS • ';

// --- Testimonial Data ---
const testimonials = [
  {
    text: 'I was very lucky to end up in this line of work. My business took off in just a few weeks. I started to make an excellent income with the help of this company. The managers always respond quickly to questions and problems and never refuse to help when you need it. Even on weekends and at night. I always receive my payments on time. The system works like clockwork. Thank you.',
    author: 'Sulton',
    location: 'Uzbekistan',
  },
  {
    text: 'Partnering with 1xBet was the best decision for my business. The support is fantastic and my income has grown significantly. Highly recommended!',
    author: 'Adebayo',
    location: 'Nigeria',
  },
  {
    text: 'The platform is reliable and easy to use. My customers are happy and my commissions are always on time. It is a pleasure to work with them.',
    author: 'Rajesh',
    location: 'India',
  },
];

// --- Main Component ---
const BusinessSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <Box sx={{ width: '100%', fontFamily: 'sans-serif' }}>
      {/* --- Green Scrolling Ticker --- */}
     <Box
  sx={{
    backgroundColor: '#5cb85c',
    color: 'white',
    py: 2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
  }}
>
  <Box
    sx={{
      display: 'inline-block',
      px: 1,
      animation: 'ticker 20s linear infinite',
      ...tickerAnimation,
    }}
  >
    <Typography
      variant="h6"
      component="span"
      sx={{ fontWeight: 'bold' }}
    >
      {tickerText.repeat(2)} {/* Repeat text to make seamless loop */}
    </Typography>
  </Box>
</Box>


      {/* --- Blue Main Content Area --- */}
      <Box sx={{ backgroundColor: '#4a90e2', py: 6, px: 2 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              mb: 5,
            }}
          >
            Build your business with 1xBet!
          </Typography>

          <Grid container spacing={4} alignItems="center">
            {/* Left Side: YouTube Video */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 Aspect Ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/SstW6H83nFE" // Updated relevant 1xBet Agent video
                  title="How to start your own business with 1xBet"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                ></iframe>
              </Box>
            </Grid>

            {/* Right Side: Testimonial Slider */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Navigation Arrows */}
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    zIndex: 1,
                  }}
                >
                  {/* Icon component-er naam change kora holo */}
                  <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    zIndex: 1,
                  }}
                >
                  {/* Icon component-er naam change kora holo */}
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>

                {/* Testimonial Content */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: '#192a56', mb: 1 }}
                  >
                    {activeTestimonial.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 2 }}
                  >
                    {activeTestimonial.location}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.primary', fontStyle: 'italic' }}
                  >
                    "{activeTestimonial.text}"
                  </Typography>
                </Box>

                {/* Pagination Dots */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  {testimonials.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor:
                          activeIndex === index ? '#4a90e2' : '#ccc',
                        mx: 0.5,
                        cursor: 'pointer',
                        transition: 'background-color 0.99s',
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default BusinessSection;