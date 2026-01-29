import React, { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// --- Data for the FAQ items ---
// I've extracted the text from the image you provided.
const faqData = [
  {
    question: 'How do I become a betting agent?',
    answer: (
      <Typography color="text.secondary">
        Details on becoming a betting agent would go here. (Content not visible
        in the image)
      </Typography>
    ),
  },
  {
    question: 'How to increase your profit as a betting agent',
    answer: (
      <Box sx={{ color: 'text.secondary' }}>
        <Typography paragraph>
          An agent's income depends directly on their customer base and the
          betting company that they are working with. There are several ways for
          an agent to increase their income:
        </Typography>
        <Box
          component="ol"
          sx={{
            listStyleType: 'decimal',
            pl: 3,
            '& li': { mb: 1.5, pl: 1 },
          }}
        >
          <li>
            <Typography>
              Expand your player base. An agent's income comes from the
              commission on bettors' transactions. The more bettors, the more
              transactions, and, of course, the more profit for the agent.
            </Typography>
          </li>
          <li>
            <Typography>
              Build and expand an agent network. By attracting new cashiers and
              forming their own network, an agent can widen their player base,
              increase the number of transactions, and, of course, increase their
              profit. The agent decides the amount of commission to pay to
              cashiers.
            </Typography>
          </li>
          <li>
            <Typography>
              Work with a betting company that offers a large sportsbook. The
              better the company, the more customers it will attract; the more
              betting options it offers, the more bets its customers will place.
              This allows an agent to make more money. Reputation, history, and
              popularity of the bookmaker are also important. All this can make
              the search for customers easier for the agent.
            </Typography>
          </li>
        </Box>
      </Box>
    ),
  },
  {
    question:
      'Can I make good money by topping up the accounts of players who place bets on sports?',
    answer: (
      <Typography color="text.secondary">
        Details on making money by topping up accounts would go here. (Content
        not visible in the image)
      </Typography>
    ),
  },
  {
    question: 'How do I become a bookmaker?',
    answer: (
      <Typography color="text.secondary">
        Details on becoming a bookmaker would go here. (Content not visible in
        the image)
      </Typography>
    ),
  },
];

// --- Main FAQ Component ---
const FAQ = () => {
  // State to keep track of which item is expanded.
  // We'll set it to 1 (index) initially to match the screenshot.
  const [expandedIndex, setExpandedIndex] = useState();

  // Function to toggle the accordion items
  const handleToggle = (panelIndex) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? panelIndex : null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, fontFamily: 'sans-serif' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#192a56', // A dark blue color
            mb: 4,
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Box>
          {faqData.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <Accordion
                key={index}
                expanded={isExpanded}
                onChange={handleToggle(index)}
                // Remove default styles for a cleaner look
                disableGutters
                elevation={0}
                square
                sx={{
                  // Remove the default top border
                  '&:before': {
                    display: 'none',
                  },
                  borderBottom: '1px solid #e0e0e0', // Add bottom border
                }}
              >
                <AccordionSummary
                  expandIcon={
                    isExpanded ? (
                      <RemoveIcon sx={{ color: '#27ae60' }} /> // Green color
                    ) : (
                      <AddIcon sx={{ color: '#2980b9' }} /> // Blue color
                    )
                  }
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                  sx={{
                    py: 1.5, // Padding top and bottom
                    px: 0, // No horizontal padding
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600, // semibold
                      fontSize: '1.1rem',
                      color: isExpanded ? '#27ae60' : '#192a56',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    pt: 0,
                    pb: 2,
                    pr: 3, // Padding on the right
                    pl: 0, // No padding on the left
                  }}
                >
                  {item.answer}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default FAQ;

