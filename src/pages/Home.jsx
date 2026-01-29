import React, { useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import HeroSection from '../components/HeroSection/HeroSection';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import StatsAndSteps from '../components/StatsAndSteps/StatsAndSteps';
import ProfitSection from '../components/ProfitSection/ProfitSection';
import AdvantagesSection from '../components/AdvantageSection/AdvantageSection';
import WhoAgentsSection from '../components/WhoAgentsSection/WhoAgentsSection';
import WorkingWithUs from '../components/WorkingWithUs/WorkingWithUs';
import FloatingCardSection from '../components/FloatingCardSection/FloatingCardSection ';
import OurSolutions from '../components/OurSolutions/OurSolutions';
import Why1xBet from '../components/Why1xBet/Why1xBet';
import FAQ from '../components/FAQ/FAQ';
import BusinessSection from '../components/BusinessSection/BusinessSection';
import AgentFormSection from '../components/AgentFormSection/AgentFormSection';
import AgentIntroSection from '../components/AgentIntroSection/AgentIntroSection';
import AgentSection from '../components/AgentSection/AgentSection';

const Home = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onAgentClick={() => setOpen(true)} />
      <HeroSection />
      <StatsAndSteps />
      <ProfitSection/>
      {/* <FeatureSection /> */}
      <AdvantagesSection />
      <WhoAgentsSection onAgentClick={() => setOpen(true)} />
      <WorkingWithUs id="working-with-us" onAgentClick={() => setOpen(true)} />
      <FloatingCardSection onAgentClick={() => setOpen(true)} />
      <OurSolutions id="solutions" />
      <Why1xBet id="why1xbet" />
      <FAQ/>
      <BusinessSection/>
      <AgentSection/>
      <AgentIntroSection/>
      <Footer />

      {/* Agent Form Modal */}
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
          <Box id="agent-form-section" sx={{ p: { xs: 2, md: 4 } }}>
            <AgentFormSection />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Home;