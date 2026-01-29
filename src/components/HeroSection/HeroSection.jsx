import React, { useState } from "react";
import { Box, Typography, Button, Stack, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import heroImg from "../../images/hero-player.png";
import mobcash from "../../images/icon-mobileapp.svg";
import web from "../../images/icon-webepos.svg";
import shop from "../../images/icon-betshop.svg";
import AgentFormSection from "../AgentFormSection/AgentFormSection";
import { Link as ScrollLink } from 'react-scroll';

const HeroSection = () => {

  const [open, setOpen] = useState(false);

  const apps = [
    { img: mobcash, label: "Mobcash app" },
    { img: web, label: "Web epos" },
    { img: shop, label: "Betshop" },
    { img: mobcash, label: "1xBet Support App" },
  ];

  return (
    <>
      <Box     
        sx={{
          maxWidth: "100%",
          minHeight: "80vh",
          backgroundColor: "#0a1a3b",
          backgroundImage: { xs: "none", md: `url(${heroImg})` },
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "contain",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: { xs: 1, md: 10 },
          py: { xs: 6, md: 0 },
          color: "#fff",
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: "550px" }, width: { md: 550 }, minWidth: { md: 400 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Make money <br /> with{" "}
            <Typography
              component="span"
              sx={{
                color: "#3ba4ff",
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              1xBet
            </Typography>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "#d0d5e2",
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
           Join the 1xBet Agent Program — one of the most trusted and fastest-growing betting platforms in the world. Start earning high commissions every month and get fast agent support from 1xbetsupport.com. Become a verified 1xBet Agent, promote 1xBet services in your region, and unlock a stable income with unlimited growth potential. Whether you're new or experienced, the official 1xBet agent system makes it easy to manage players, track profits, and build your own business with full support from the 1xBet team and dedicated agent support (1xBet Support App).
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "#59c12e",
                color: "#fff",
                fontWeight: 600,
                px: 3,
                py: 1.2,
                width: { xs: "100%", sm: "auto" },
                "&:hover": { backgroundColor: "#4ca726" },
              }}
            >
              Become an Agent
            </Button>

            <ScrollLink to="working-with-us" smooth={true} duration={500} offset={-70} style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#3ba4ff",
                  color: "#3ba4ff",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { backgroundColor: "#3ba4ff", color: "#fff" },
                }}
              >
                Working with us
              </Button>
            </ScrollLink>
          </Stack>

          {/* --- FIXED: icons same size, no distortion --- */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              gap: 2,
              mt: 4,
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {apps.map((app, idx) => (
              <Button
                key={app.label}
                variant="contained"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 120,
                  mb: 0,
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <Box component="img" src={app.img} alt={app.label} sx={{ width: 24, height: 24 }} />
                {app.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* MODAL OPEN */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: { xs: 2, md: 8 }
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 700,
            mx: "auto",
            backgroundColor: "#fff",
            borderRadius: "16px",
            outline: "none",
            position: "relative",
            boxShadow: "0 20px 60px rgba(10, 26, 59, 0.3)",
            border: "2px solid #0a1a3b",
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
            "@keyframes slideUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              backgroundColor: "#0a1a3b",
              color: "#fff",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "#1a2a4b",
              },
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          {/* Form Content */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <AgentFormSection />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default HeroSection;
