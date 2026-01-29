// src/components/WorkingWithUs.jsx
import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import bettingImg from "../../images/betshop_1x.webp"; // replace if needed

const tabData = {
  agent: {
    title: "Small investments, fast results!",
    description: `Why become a secret 007 agent when being a 1xBet agent is much more lucrative! An agent is someone who seeks out bettors and earns a commission by helping them to deposit and withdraw funds to and from their account. Using our app and your phone, you can open your own mobile cashpoint, accept deposits, process payouts and, most importantly, earn money. You will get a head start in the industry and help new customers find their feet in the world of betting with a leading bookmaker. To those who have bigger things in mind, we offer building their own agent network.`,
    steps: [
      "Send request",
      "Please wait for our specialist to contact you",
      "Make your first deposit",
      "Install our Android mobile app!",
      "And that's it! Now go make some money",
    ],
    showImage: false,
  },
  bookmaker: {
    title: "Looking to accept bets yourself?",
    description: `We have just the solution to help YOU become your customers' guide through the world of sports betting, so they don't even need to register on our website. This allows you to not only earn a commission from transactions, but also take home a percentage of the GGR (the difference between players' stakes and winnings).`,
    steps: [
      "Send request",
      "Please wait for our specialist to contact you",
      "Purchase the recommended terminal",
      "Make your first deposit",
      "Install our software",
      "That's all! Accept bets and start earning!",
    ],
    showImage: false,
  },
  betting: {
    title: "Open your own betting shop!",
    description: `Do you want to create your own offline betting shop? We will provide you with everything you need — from equipment and software to full technical support. You’ll receive stable income from every customer’s bet!`,
    steps: [
      "Send request",
      "Sign the contract",
      "Purchase or rent the required equipment",
      "Install our software and set up your shop",
      "Start accepting bets and earn revenue!",
    ],
    showImage: true,
  },
};

const tabOrder = ["agent", "bookmaker", "betting"];

// small animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function WorkingWithUs({ onAgentClick }) {
  const [activeTab, setActiveTab] = useState("agent");
  const { title, description, steps, showImage } = tabData[activeTab];

  return (
    <Box
      id="working-with-us"
      sx={{ background: "#f5f8fc", py: { xs: 6, md: 10 }, px: { xs: 2, md: 8 } }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#0d2a5a", fontWeight: 700, textAlign: "center", mb: 4 }}
      >
        Working with Us
      </Typography>
{/* tabs */}
{/* tabs */}
<Box
  sx={{
    display: "flex",
    justifyContent: { xs: "center", md: "center" },
    gap: 2,
    mb: 6,
    flexWrap: { xs: "nowrap", md: "wrap" },
    maxWidth: { md: 600 },
    mx: { md: "auto" },
  }}
>
  {tabOrder.map((t) => (
    <Button
      key={t}
      onClick={() => setActiveTab(t)}
      sx={{
        px:1.8,
        py: 0.1,
        fontWeight: 700,
        borderRadius: 2,
        textTransform: "none",
        border: "1.5px solid #2b65d9",
        backgroundColor: activeTab === t ? "#2b65d9" : "#fff",
        color: activeTab === t ? "#fff" : "#2b65d9",
        "&:hover": { backgroundColor: activeTab === t ? "#244e9a" : "#e9f1ff" },
        minWidth: { xs: "auto", md: 120 }, // mobile auto width, desktop fixed
      }}
    >
      {t === "agent" ? "Agent" : t === "bookmaker" ? "Bookmaker" : "Betting shop"}
    </Button>
  ))}
</Box>



      {/* main grid */}
      <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* left column: text */}
        <Grid item xs={12} lg={4}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "-text"}
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={fadeInUp}
              style={{ width: "100%", maxWidth: 350 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#2b65d9", mb: 2 }}>
                {title}
              </Typography>

              <Typography variant="body1" sx={{ color: "#23324a", lineHeight: 1.7, mb: 3 }}>
                {description}
              </Typography>

              <Button
                variant="contained"
                onClick={onAgentClick}
                sx={{
                  backgroundColor: "#7be052",
                  color: "#0d2750",
                  fontWeight: 800,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#6ed245" },
                }}
              >
                START EARNING
              </Button>
            </motion.div>
          </AnimatePresence>
        </Grid>

        {/* right column: steps or image */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              {showImage ? (
                <motion.img
                  key="img"
                  src={bettingImg}
                  alt="betting shop"
                  style={{ maxWidth: 420, width: "100%", borderRadius: 8 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                />
              ) : (
                <motion.div
                  key="steps"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  style={{ width: "100%", maxWidth: 420 }}
                >
                  {/* steps list: big blue number + thin green vertical line + text */}
                  {steps.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.45, delay: i * 0.08 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box sx={{ minWidth: 60, textAlign: "right", pr: 1 }}>
                          <Typography sx={{ color: "#2b65d9", fontWeight: 800, fontSize: "1.6rem" }}>
                            {String(i + 1).padStart(2, "0")}
                          </Typography>
                        </Box>

                        {/* thin vertical green divider */}
                        <Box sx={{ width: 6, display: "flex", justifyContent: "center" }}>
                          <Box sx={{ width: 2, height: 34, backgroundColor: "#7be052", borderRadius: 1 }} />
                        </Box>

                        <Box sx={{ pl: 2 }}>
                          <Typography sx={{ color: "#0d2750", fontWeight: 600 }}>{s}</Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
