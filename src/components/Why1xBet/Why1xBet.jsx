import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import personImg from "../../images/betShop_about_1x.png"; // person image
import awardImg from "../../images/about_medals_1x.png"; // medal row
import moneyImg from "../../images/betShop_about_money_1x.png"; // flying cash note image

const Why1xBet = () => {
  return (
    <Box id="why1xbet"
      sx={{
        backgroundColor: "#fff",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 6 },
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        
      >
        {/* ===== Left side text ===== */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{
              color: "#0b2a5b",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Why{" "}
            <Box component="span" sx={{ color: "#2e89dc" }}>
              1xBet?
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#333",
              lineHeight: 1.7,
              mb: 2,
            }}
          >
            1xBet is one of the world’s leading betting companies. For more
            than 10 years, we have worked to develop an enormous network of
            betting shops and websites.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#333",
              lineHeight: 1.7,
              mb: 2,
            }}
          >
            We offer our bettors the biggest choice of sports and events for
            betting, including unusual events such as cinema, television,
            economics, politics, and other spheres of life. Our audience
            includes over 1 million customers from 40 countries throughout the
            world who place their bets every day with us.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#333",
              lineHeight: 1.7,
            }}
          >
            Today, 1xBet is also an ideal platform for starting your own
            business. We are offering you the opportunity to become our agent
            and start making money together with us. Would you like to join us
            and grow together?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#333",
              mt: 2,
              lineHeight: 1.6,
            }}
          >
            Need help getting started or with agent login & the app? Our dedicated agent support is available at 1xbetsupport.com — quick troubleshooting and onboarding for new and current 1xBet agents.
          </Typography>
        </Grid>

        {/* ===== Right side person + money animation ===== */}
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Person image */}
          <Box
            component="img"
            src={personImg}
            alt="1xBet Agent"
            sx={{
              width: "100%",
              maxWidth: "420px",
              objectFit: "contain",
              zIndex: 2,
            }}
          />

          {/* Flying money animation */}
          {[...Array(4)].map((_, i) => (
            <motion.img
              key={i}
              src={moneyImg}
              alt="Flying Money"
              initial={{ x: -100, y: 0, opacity: 0 }}
              animate={{
                x: [0, 80, -60, 0],
                y: [0, -20, 10, 0],
                opacity: [0.8, 1, 0.8, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: `${60 + i * 10}px`,
                top: `${20 + i * 10}%`,
                right: `${5 + i * 7}%`,
                zIndex: 1,
              }}
            />
          ))}
        </Grid>
      </Grid>

      {/* ===== Awards Row (bottom) ===== */}
      <Box
        sx={{
          mt: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box
          component="img"
          src={awardImg}
          alt="Awards"
          sx={{
            width: { xs: "80%", sm: "70%", md: "50%" },
            height: "auto",
            maxWidth: "600px",
          }}
        />
      </Box>
    </Box>
  );
};

export default Why1xBet;
