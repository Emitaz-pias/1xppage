import React, { useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AgentPromo from '../components/Promotions/AgentPromo';
import AgentFormSection from '../components/AgentFormSection/AgentFormSection';

const Promotions = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <AgentPromo onAgentClick={() => setOpen(true)} />
      
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
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <AgentFormSection />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Promotions;