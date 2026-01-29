import React from "react";
import Box from '@mui/material/Box';
import AgentFormSection from "../AgentFormSection/AgentFormSection";

export default function AgentSection() {
  // Simple wrapper: reuse the AgentFormSection component so there's a single source of truth.
  return (
    <Box id="agent-form-section" margin={'0.5em'}>
      <AgentFormSection />
    </Box>
  );
}
