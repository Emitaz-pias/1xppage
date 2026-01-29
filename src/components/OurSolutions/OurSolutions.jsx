import React, { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { PhoneAndroid, PointOfSale, Storefront } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const OurSolutions = () => {
  const [activeTab, setActiveTab] = useState("mobcash");
  const [activeBetshopSub, setActiveBetshopSub] = useState("Self-service terminal");

  const tabData = {
    mobcash: {
      title: "MOBCASH APP",
      icon: <PhoneAndroid />,
      content: `We have developed a special mobile app with an intuitive interface, available in English, French and Russian, which you can use to accept deposits, make payments, set up your own agent network, and earn money. Your own business right in your pocket!\n\n• Accept deposits and top up players’ balances.\n• Make withdrawals from users’ accounts and pay them out in cash.\n• Create your own cashier network for a specific region.\n• Enter new markets and open a business in a new country.`,
    },
    webePos: {
      title: "WEB EPOS",
      icon: <PointOfSale />,
      content: `Our WEB EPOS system allows you to process bets quickly and safely from any browser. Agents can accept payments and withdraw winnings easily, without additional software.\n\n• Access from any browser, no installation required.\n• Instant processing of deposits and withdrawals.\n• Detailed reporting and balance tracking.\n• Multi-language support for global operations.`,
    },
    betshop: {
      title: "BETSHOP",
      icon: <Storefront />,
      subTabs: ["EPOS", "Self-service terminal", "Live", "Back office"],
      content: {
        EPOS: `Our EPOS system ensures quick and secure bet placements for all agents.\n\n• Simple setup and operation.\n• Instant settlements.\n• Reliable statistics and reporting.`,
        "Self-service terminal": `Our software is compatible with betting terminals by most well-known manufacturers, and is available in 42 languages.\n\n• Live/pre-match bets.\n• Bet constructor.\n• HD broadcasts.\n• Statistics and results.\n• Super Accumulator betting.`,
        Live: `Live betting lets your customers experience the thrill of real-time wagers!\n\n• Fast odds updates.\n• Multiple live markets.\n• Smooth streaming experience.`,
        "Back office": `Manage your entire agent network with ease.\n\n• Monitor financials.\n• Track agents' activities.\n• Generate performance reports.`,
      },
    },
  };

  const { title, content, subTabs } = tabData[activeTab];

  const getDisplayedContent =
    activeTab === "betshop"
      ? content[activeBetshopSub]
      : content;

  return (
    <Box id="solutions" sx={{ backgroundColor: "#f5f7fa",py: 8, px: { xs: 2, md: 10 } }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#0b2447",
          mb: 6,
        }}
      >
        Our Solutions
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "flex-start",
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {/* LEFT MENU (Mobile: Single Row, Desktop: Vertical Column) */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            justifyContent: { xs: "space-between", md: "flex-start" },
            alignItems: { xs: "center", md: "flex-start" },
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            gap: { xs: 0, md: 3 },
            pb: { xs: 4, md: 0 },
            maxWidth: { md: 320 },
            minWidth: { md: 220 },
          }}
        >
          {Object.keys(tabData).map((tab) => {
            const active = activeTab === tab;
            return (
              <Box
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Reset sub-tab selection when changing main tabs
                  if (tab !== 'betshop') {
                    setActiveBetshopSub("Self-service terminal");
                  }
                }}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, md: 1.2 }, // Reduced gap on mobile
                  px: { xs: 1, md: 2 }, // Reduced horizontal padding on mobile
                  py: 1,
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  backgroundColor: active ? "#e7f9df" : "transparent",
                  "&:hover": { backgroundColor: "#e7f9df" },
                  
                  // Mobile Fix: Allocate proportional space to each button
                  minWidth: { xs: '32%', md: 'auto' },
                  maxWidth: { xs: '33.33%', md: 'auto' },
                }}
              >
                <Box
                  sx={{
                    color: active ? "#82d141" : "#0b2447",
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {tabData[tab].icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: active ? "#82d141" : "#0b2447",
                    // Mobile Fix: Slightly smaller font size on extra small screens
                    fontSize: { xs: '12px', sm: '14px' },
                    whiteSpace: 'nowrap', // Ensure text stays on one line
                  }}
                >
                  {tabData[tab].title}
                </Typography>
              </Box>
            );
          })}
        </Grid>

        {/* RIGHT CONTENT (Adjusted to md=8 for desktop balance) */}
        <Grid item xs={12} md={8}> 
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeBetshopSub}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  p: 3,
                  boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
                  height: { xs: 'auto', md: "330px" },
                  overflowY: "auto",
                  position: "relative",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#82d141",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#e8f7e4",
                    borderRadius: "10px",
                  },
                }}
              >
                {/* Betshop Sub-Buttons */}
                {activeTab === "betshop" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      mb: 2,
                      borderBottom: '1px solid #eee',
                      pb: 2,
                    }}
                  >
                    {subTabs.map((btn) => (
                      <Button
                        key={btn}
                        onClick={() => setActiveBetshopSub(btn)}
                        variant={
                          activeBetshopSub === btn ? "contained" : "outlined"
                        }
                        sx={{
                          backgroundColor:
                            activeBetshopSub === btn ? "#82d141" : "transparent",
                          color:
                            activeBetshopSub === btn ? "#fff" : "#0b2447",
                          borderColor: "#82d141",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "8px",
                          fontSize: "14px",
                          px: 3,
                          py: 1,
                          boxShadow: activeBetshopSub === btn ? '0 4px 6px rgba(130, 209, 65, 0.4)' : 'none',
                          "&:hover": {
                            backgroundColor:
                              activeBetshopSub === btn
                                ? "#74c33c"
                                : "#e8f7f4",
                            borderColor: "#74c33c",
                            boxShadow: activeBetshopSub === btn ? '0 4px 8px rgba(130, 209, 65, 0.6)' : 'none',
                          },
                        }}
                      >
                        {btn}
                      </Button>
                    ))}
                  </Box>
                )}

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0b2447",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>

                {/* Content */}
                <Typography
                  sx={{
                    color: "#0b2447",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {getDisplayedContent}
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OurSolutions;