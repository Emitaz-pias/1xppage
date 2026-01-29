import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const Header = ({ onAgentClick }) => {
  return (
    <Box  sx={{ position: 'relative',  maxWidth: '100vw', }}>
      <Navbar onAgentClick={onAgentClick} />
      <Box />
    </Box>
  );
};

export default Header;