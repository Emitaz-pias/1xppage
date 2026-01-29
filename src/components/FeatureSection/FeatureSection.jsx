import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const FeatureSection = () => {
  const features = [
    {
      title: "Fast Payments",
      desc: "Withdraw your earnings anytime with instant payout.",
    },
    {
      title: "Easy Management",
      desc: "Control your agents, commissions, and income from one place.",
    },
    {
      title: "Global Network",
      desc: "Join thousands of partners working with 1xBet worldwide.",
    },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: "#0f2048", color: "#fff" }}>
      <Typography variant="h4" textAlign="center" fontWeight={700} mb={6}>
        Why Become an Agent?
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ px: { xs: 2, md: 10 } }}
      >
        {features.map((f, i) => (
          <Box
            key={i}
            sx={{
              maxWidth: 300,
              textAlign: "center",
              p: 3,
              backgroundColor: "#142a5e",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              {f.title}
            </Typography>
            <Typography sx={{ color: "#d0d5e2" }}>{f.desc}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default FeatureSection;
