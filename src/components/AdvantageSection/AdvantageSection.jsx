import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Wallet, Settings, Briefcase, Languages } from "lucide-react";

const advantages = [
  {
    icon: <Wallet size={40} color="#6cd34c" />,
    title: "An individual approach and a personal manager for each agent",
    highlight: "",
  },
  {
    icon: <Settings size={40} color="#6cd34c" />,
    title: (
      <>
        We provide our own <span style={{ color: "#6cd34c" }}>user-friendly CRM system</span>, 
        which enables you to significantly boost your income
      </>
    ),
  },
  {
    icon: <Briefcase size={40} color="#6cd34c" />,
    title: (
      <>
        We work with <span style={{ color: "#6cd34c" }}>unique partners</span>
      </>
    ),
  },
  {
    icon: <Languages size={40} color="#6cd34c" />,
    title: (
      <>
        We provide you with the user-friendly, multi-language{" "}
        <span style={{ color: "#6cd34c" }}>MobCash app</span>, available on Android.
      </>
    ),
  },
];

const AdvantagesSection = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#0d2a5a",
        color: "white",
        textAlign: "center",
        py: 8,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 6,
        }}
      >
        Our advantages
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        {advantages.map((adv, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box>
              <Box sx={{ mb: 2 }}>{adv.icon}</Box>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.5,
                  fontWeight: 500,
                  maxWidth: 280,
                  margin: "0 auto",
                }}
              >
                {adv.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvantagesSection;
