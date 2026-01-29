import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import {
  Verified,
  WorkOutline,
  BusinessCenter,
  StarOutline,
} from "@mui/icons-material";
import benifitPhone1x from '../../images/benefit_phone_1x.webp'
import benifitMoney1x from '../../images/benefit_money_1x.webp'
const points = [
  {
    icon: <WorkOutline sx={{ color: "#4cc45a", fontSize: 36 }} />,
    title: "An AGENT can make money 24/7",
    desc: "The only thing you need to start making money is a smartphone. You can work wherever and whenever you want!",
  },
  {
    icon: <BusinessCenter sx={{ color: "#4cc45a", fontSize: 36 }} />,
    title: "This is a chance to start your own business",
    desc: "Agents act as intermediaries, helping customers with deposits and withdrawals and receiving a commission.",
  },
  {
    icon: <Verified sx={{ color: "#4cc45a", fontSize: 36 }} />,
    title: "The work is completely safe",
    desc: "The 1xBet agent network ensures that work done by agents to facilitate transactions remains completely anonymous, keeping you safe and protected from financial risk.",
  },
  {
    icon: <StarOutline sx={{ color: "#4cc45a", fontSize: 36 }} />,
    title: "1xBet is one of the world's leading bookmakers",
    desc: "Our huge sportsbook ensures that customers always have something to bet on. That means an agent can provide themselves with a tidy income.",
  },
];

const ProfitSection = () => {
  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 10 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        maxWidth: { md: 1200 },
        mx: { md: "auto" },
      }}
    >
      {/* Left Content */}
      <Box flex={1}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign={{ xs: "center", md: "left" }}
          color="#0a1a3b"
          mb={4}
        >
          Why is being an agent{" "}
          <Box component="span" color="#0071ce">
            PROFITABLE?
          </Box>
        </Typography>

        <Stack spacing={4}>
          {points.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Box display="flex" alignItems="flex-start" gap={2}>
                {item.icon}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="#0a1a3b"
                    mb={0.5}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="#333">
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Box>

      {/* Right Image */}
      <Box
        flex={1}
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Phone image with a gentle floating animation */}
        <motion.img
          src={benifitPhone1x}
          alt="Agent Phone"
          style={{
            width: "100%",
            maxWidth: 420,
            height: "auto",
            zIndex: 1,
          }}
          // entrance animation only; no continuous floating
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        />

        {/* Animated money image that floats up from the phone */}
        <motion.img
          src={benifitMoney1x}
          alt="Benefit Money"
          style={{
            position: "absolute",
            // adjusted to sit visually inside the phone area above the blue badge
            right: 70,
            bottom: 40,
            width: 180,
            height: "auto",
            zIndex: 4,
            pointerEvents: "none",
          }}
          // keep the money animation moving from near the phone's top toward its bottom,
          // but slower: set speed to 0.25x the previous (duration increased from 6s -> 24s)
          initial={{ opacity: 1, y: -90, scale: 1 }}
          // reduce downward travel by a further 25% (current delta 35px -> 26.25px -> ~26)
          // so final position is ~-64 (from -90 + 26)
          animate={{ y: [-90, -64] }}
          // increase speed by another 10%: previous duration 21.8s -> ~19.8s
          transition={{ duration: 25.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", repeatDelay: 1.0 }}
        />

        {/* Blue badge overlay with its own floating animation */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          // badge stays static after entrance; improved wrapping to prevent overflow
          style={{
            position: "absolute",
            bottom: -40,
            right: 0,
            backgroundColor: "#0071ce",
            color: "#fff",
            borderRadius: "50%",
            width: 160,
            height: 160,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "14px",
            boxSizing: "border-box",
            fontWeight: 600,
            fontSize: "0.76rem",
            lineHeight: 1.05,
            zIndex: 3,
            overflow: "hidden",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          OVER 50000 PEOPLE HAVE ALREADY BECOME 1XBET AGENTS.
          <br />
          <Box component="span" color="#00ffb3">
            JOIN
          </Box>{" "}
          AND MAKE MONEY AS A BETTING BROKER!
        </motion.div>
      </Box>
    </Box>
  );
};

export default ProfitSection;
