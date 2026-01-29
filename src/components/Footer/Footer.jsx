import React from 'react';
import {
  Container,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from "../../images/logo.png";
import CookieModal from '../CookieModal/CookieModal';
import { useState } from 'react';

// --- Main Component ---
const Footer = () => {
  const [cookieOpen, setCookieOpen] = useState(false);
  const navItems = [
    { title: 'About us', href: '#why1xbet' },
    { title: 'Working with us', href: '#working-with-us' },
    { title: 'Solutions', href: '#solutions' },
    { title: 'Contacts', href: '#agent-form-section' },
    { title: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        maxWidth: '100vw',
        fontFamily: 'sans-serif',
        backgroundColor: '#102A4C', // Dark blue background from images
        py: { xs: 2.5, sm: 3, md: 4 }, // Responsive padding
        px: { xs: 2, sm: 2.5, md: 3 },
        color: 'white',        
      }}
      
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Top Section: Logo + Nav Links */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 2, md: 3 },
            mb: { xs: 2.5, md: 3 },
            pb: { xs: 2, md: 2.5 },
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box component="img" src={logo} alt="1xBet" sx={{ height: { xs: 28, sm: 32, md: 32 }, cursor: 'pointer' }} />
          </Box>

          {/* Nav Links */}
          <Box
            component="nav"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2.5, md: 2.5 },
            }}
          >
            {navItems.map((item) => {
              // Handle cookie-policy modal
              if (item.href === '/cookie-policy') {
                return (
                  <Typography 
                    key={item.title} 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 500, 
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      cursor: 'pointer', 
                      '&:hover': { color: '#b0bec5' },
                      transition: 'color 0.3s'
                    }} 
                    onClick={() => setCookieOpen(true)}
                  >
                    {item.title}
                  </Typography>
                );
              }

              if (item.href && item.href.startsWith('/')) {
                return (
                  <Link
                    key={item.title}
                    component={RouterLink}
                    to={item.href}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': {
                        color: '#b0bec5',
                      },
                      transition: 'color 0.3s'
                    }}
                  >
                    {item.title}
                  </Link>
                );
              }

              if (item.href && item.href.startsWith('#')) {
                return (
                  <ScrollLink key={item.title} to={item.href.replace('#', '')} smooth={true} duration={500} offset={-70} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                    <Typography sx={{ color: 'white', fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' }, '&:hover': { color: '#b0bec5' }, transition: 'color 0.3s' }}>{item.title}</Typography>
                  </ScrollLink>
                );
              }

              return null;
            })}
          </Box>
        </Box>

        {/* Cookie policy modal */}
        <CookieModal open={cookieOpen} onClose={() => setCookieOpen(false)} />

        {/* Middle Section: Quick Links */}
        {(() => {
          const SHOW_KEYWORD_LINKS = true;
          if (!SHOW_KEYWORD_LINKS) return null;

          const keywords = [
            '1xBetSupport',
            '1xbetsupport.com',
            '1xbet agent support',
            '1xbetagent support',
            '1xBet support app',
            '1xBet agent help',
            '1xBet customer support',
            '1xbet agent Bangladesh',
            '1xbet agent India',
            '1xbet agent Pakistan',
            '1xbet agent Nepal',
            '1xbet agent login'
          ];

          return (
            <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 }, pb: { xs: 2, md: 2.5 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="body2" sx={{ color: '#b0bec5', mb: 1, fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 0.8, sm: 1.2 } }}>
                {keywords.map((k) => (
                  <Box
                    key={k}
                    component="a"
                    href="#agent-form-section"
                    title={k}
                    sx={{ 
                      color: '#b0bec5', 
                      textDecoration: 'none', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
                      '&:hover': { color: 'white' },
                      transition: 'color 0.3s'
                    }}
                  >
                    {k}
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })()}

        {/* Bottom Section: Copyright Info */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" display="block" sx={{ color: '#b0bec5', fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
            Copyright © 2007-202X "1xBet" — 1xbetsupport.com. All rights reserved.
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: '#b0bec5', mt: 0.75, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
            1xBet uses cookies to enhance your website experience.
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: '#b0bec5', mt: 0.75, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
            By continuing to use the website, you agree to the use of these cookies.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;