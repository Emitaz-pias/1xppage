import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import agentImg from "../../images/agent_inform_1x.png";

const items = [
  {
    text: (
      <>
        People who want to build their own{" "}
        <span style={{ color: "#9be15d" }}>international agent</span> network and
        increase their income
      </>
    ),
  },
  {
    text: (
      <>
        People who are interested in sports betting and want to find a{" "}
        <span style={{ color: "#9be15d" }}>reliable way</span> to make money in
        this industry
      </>
    ),
  },
  {
    text: (
      <>
        People who are ready to{" "}
        <span style={{ color: "#9be15d" }}>change their lives</span> with a new
        source of income
      </>
    ),
  },
];

// Animation variants for smooth scroll effect
const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.25 },
  }),
};

const WhoAgentsSection = ({ onAgentClick }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f9fc",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 8 },
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          flexDirection: { xs: "column-reverse", lg: "row" },
        }}
      >
        {/* LEFT SIDE */}
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#0d2a5a",
              mb: 4,
              textAlign: { xs: "center", lg: "left" },
            }}
          >
            Who are <span style={{ color: "#2b65d9" }}>1xBet</span> agents?
          </Typography>

          {/* Animated list */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: { xs: "center", lg: "flex-start" },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }} // 👈 ensures animation on scroll
                custom={index}
                style={{ width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#0d2a5a",
                    borderRadius: 2,
                    color: "white",
                    p: 2,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    maxWidth: 500,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: "#9be15d", fontSize: 28, mr: 2 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={onAgentClick}
            sx={{
              mt: 4,
              backgroundColor: "#9be15d",
              color: "#0d2a5a",
              fontWeight: 600,
              px: 4,
              py: 1.2,
              borderRadius: 1,
              alignSelf: { xs: "center", lg: "flex-start" },
              "&:hover": { backgroundColor: "#8ad34b" },
            }}
          >
            BECOME AN AGENT
          </Button>
        </Grid>

        {/* RIGHT SIDE (IMAGE) */}
        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "rgba(43, 101, 217, 0.1)",
                transform: "translate(-50%, -50%)",
              }}
            ></Box>
            <Box
              component="img"
              src={agentImg}
              alt="agent"
              sx={{
                width: "100%",
                maxWidth: 380,
                position: "relative",
                zIndex: 2,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhoAgentsSection;
