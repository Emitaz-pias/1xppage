import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../images/logo.png";
import { Link as ScrollLink } from "react-scroll";
import CookieModal from '../CookieModal/CookieModal';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = ({ onAgentClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { title: "About us", href: "why1xbet" },
    { title: "Working with Us", href: "working-with-us" },
    { title: "Solutions", href: "solutions" },
    { title: "Contacts", href: "agent-form-section" },
    { title: "Cookie Policy", href: "/cookie-policy", external: true },
  ];

  const [cookieOpen, setCookieOpen] = useState(false);

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      {/* <List>
        {menuItems.map((item, i) => (
          <ListItem
            key={i}
            button
            sx={{
              "&:hover .MuiListItemText-primary": { color: "#3ba4ff" },
            }}
          >
            {!item.external ? (
              <ScrollLink
                to={item.href}
                smooth={true}
                duration={500}
                style={{ textDecoration: "none", cursor: "pointer" }}
                offset={-70}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    color: "#113264",
                    fontWeight: 500,
                  }}
                />
              </ScrollLink>
            ) : (
              item.href === '/cookie-policy' ? (
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    color: "#113264",
                    fontWeight: 500,
                  }}
                  onClick={() => { setCookieOpen(true); setMobileOpen(false); }}
                  sx={{ cursor: 'pointer' }}
                />
              ) : (
                <RouterLink to={item.href} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMobileOpen(false)}>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      color: "#113264",
                      fontWeight: 500,
                    }}
                  />
                </RouterLink>
              )
            )}
          </ListItem>
        ))}

        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            onAgentClick();
            setMobileOpen(false);
          }}
          sx={{
            mt: 2,
            background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "6px",
            transition: "all 0.3s ease",
            "&:hover": { 
              background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
              boxShadow: "0 6px 20px rgba(59, 164, 255, 0.4)",
            },
          }}
        >
          Become an Agent
        </Button>
      </List> */}
    </Box>
  );

  return (
    <AppBar position="static" sx={{ 
      background: "linear-gradient(135deg, #113264 0%, #1a4a8c 100%)",
      boxShadow: "0 4px 12px rgba(17, 50, 100, 0.2)",
      py: 1 
    }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box component="img" src={logo} alt="logo" sx={{ height: 20 }} />

        {/* Desktop Menu */}
        {/* <Stack
          direction="row"
          spacing={4}
          sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}
        >
          {menuItems.map((item, index) =>
            !item.external ? (
              <ScrollLink
                key={index}
                to={item.href}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                style={{ color: "#d0d5e2", cursor: "pointer", textDecoration: "none" }}
              >
                <Typography variant="body2" sx={{ "&:hover": { color: "#3ba4ff" } }}>
                  {item.title}
                </Typography>
              </ScrollLink>
            ) : (
              item.href === '/cookie-policy' ? (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: "#d0d5e2",
                    cursor: "pointer",
                    textDecoration: 'none',
                    '&:hover': { color: "#3ba4ff" },
                  }}
                  onClick={() => setCookieOpen(true)}
                >
                  {item.title}
                </Typography>
              ) : (
                <Typography
                  key={index}
                  component={RouterLink}
                  to={item.href}
                  variant="body2"
                  sx={{
                    color: "#d0d5e2",
                    cursor: "pointer",
                    textDecoration: 'none',
                    '&:hover': { color: "#3ba4ff" },
                  }}
                >
                  {item.title}
                </Typography>
              )
            )
          )}

          <Button
            variant="contained"
            onClick={onAgentClick}
            sx={{
              background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
              color: "#fff",
              px: 3,
              fontWeight: 700,
              borderRadius: "6px",
              transition: "all 0.3s ease",
              "&:hover": { 
                background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
                boxShadow: "0 6px 20px rgba(59, 164, 255, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Become an Agent
          </Button>
        </Stack> */}

        {/* Mobile Animated Icon */}
        {/* <IconButton
          sx={{ display: { xs: "block", md: "none" }, color: mobileOpen ? '#fff' : '#fff', zIndex: 1301 }}
          onClick={handleDrawerToggle}
        >
          <Box sx={{ transition: '0.3s', color: '#000000', transform: mobileOpen ? 'rotate(180deg)' : 'none' }}>
            {mobileOpen ? <CloseIcon sx={{ color: '#000000' }} /> : <MenuIcon sx={{ color: '#fff' }} />}
          </Box>
        </IconButton> */}
      </Toolbar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
      <CookieModal open={cookieOpen} onClose={() => setCookieOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
