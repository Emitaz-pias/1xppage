import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import introImg from "../../images/about_man_1x.png";
import handImg from "../../images/about_man_hand_1x.webp";

const AgentIntroSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Image Side */}
          <Grid item xs={12} md={6} sx={{ position: "relative", minHeight: 320 }}>
            <Box
              component="img"
              src={introImg}
              alt="1xBet Agent"
              sx={{
                width: "100%",
                maxWidth: 420,
                display: "block",
                mx: { xs: "auto", md: 0 },
                borderRadius: "20px",
                zIndex: 1,
                position: 'relative',
              }}
            />
            <Box
              component="img"
              src={handImg}
              alt="Agent Hand Phone"
              sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: 270,
                maxWidth: "70vw",
                borderRadius: "20px",
                zIndex: 2,
                animation: "phoneShakeReal 2.5s cubic-bezier(.4,.01,.6,1) infinite",
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
                transition: 'filter 0.3s',
                pointerEvents: 'none',
                mixBlendMode: 'multiply',
              }}
            />
            <style>{`
              @keyframes phoneShakeReal {
                0% { transform: rotate(-4deg) translateY(0); }
                15% { transform: rotate(-2deg) translateY(-2px); }
                30% { transform: rotate(0deg) translateY(-4px); }
                50% { transform: rotate(1deg) translateY(-2px); }
                70% { transform: rotate(2deg) translateY(0); }
                100% { transform: rotate(-4deg) translateY(0); }
              }
            `}</style>
          </Grid>

          {/* Text Side */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0D2040",
                mb: 2,
                lineHeight: 1.3,
              }}
            >
              Become a 1xBet agent and start earning today!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                mb: 2,
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              After joining the 1xBet agent program, you will have an opportunity
              to earn money without investing. As an agent, you will be able to
              top up players' accounts, withdraw funds, and receive a commission
              for each transaction. Work wherever and whenever you want using
              just a smartphone.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#444",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              1xBet is one of the world leaders in sports betting, offering an
              extensive sportsbook and complete transaction security.
              Successfully develop your business by creating a network of agents
              and increasing your income. Join a team of professionals and start
              earning in the world of betting now!
              {/* SEO/support copy */}
              <br />
              <strong>Agent support & help:</strong> If you need assistance with agent login, app setup or payouts, visit 1xbetsupport.com for fast, specialist help.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AgentIntroSection;
