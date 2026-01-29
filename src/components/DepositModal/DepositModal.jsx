import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
} from "@mui/material";
import DepositAddressModal from "./DepositAddressModal";

const DepositModal = ({ open, onClose, method }) => {
  const [addressModalOpen, setAddressModalOpen] = React.useState(false);

  const handleConfirm = () => {
    console.log("Confirm button clicked"); // Debug log
    setAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    console.log("Address modal closing"); // Debug log
    setAddressModalOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            margin: { xs: "16px", sm: "32px" },
            maxHeight: "calc(100vh - 32px)",
          }
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 4 },
            background: "linear-gradient(135deg, #f9fbff 0%, #f0f6ff 100%)",
            overflow: "auto",
          }}
        >
          {/* Header Icons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #e8f0ff 0%, #dde8f5 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #3ba4ff",
              }}
            >
              <img
                src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                alt="USDT"
                width={32}
              />
            </Box>
            <Box
              sx={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #e8f0ff 0%, #dde8f5 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #3ba4ff",
              }}
            >
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="ETH"
                width={32}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#113264",
              textAlign: "center",
              mb: 2.5,
            }}
            align="center"
          >
            Cryptocurrency Deposit
          </Typography>

          {/* Warning Box */}
          <Box
            sx={{
              backgroundColor: "#fee",
              border: "2px solid #f5c6cb",
              borderRadius: "8px",
              p: 2,
              mb: 2.5,
            }}
          >
            <Typography
              sx={{
                color: "#721c24",
                fontWeight: 700,
                mb: 1.2,
                fontSize: "0.95rem",
              }}
              align="center"
            >
              ⚠️ ONLY Send USDT (ERC20)
            </Typography>

            <Typography
              sx={{
                color: "#721c24",
                fontSize: "0.85rem",
                mb: 1,
                lineHeight: 1.6,
              }}
              align="center"
            >
              Do NOT use BEP2, BEP20, OMNI, TRC20, SOL or other network standards. You may lose your funds.
            </Typography>

            <Typography
              sx={{
                color: "#721c24",
                fontSize: "0.85rem",
                mb: 1,
                lineHeight: 1.6,
              }}
              align="center"
            >
              ONLY make deposits through the Ethereum (ERC20) network.
            </Typography>

            <Typography
              sx={{
                color: "#721c24",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
              align="center"
            >
              The use of contract addresses is not allowed!
            </Typography>
          </Box>

          {/* Info Box */}
          <Box
            sx={{
              backgroundColor: "#e7f3ff",
              border: "2px solid #3ba4ff",
              borderRadius: "8px",
              p: 2,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#113264",
                lineHeight: 1.6,
              }}
              align="center"
            >
              By clicking the <strong>"Confirm"</strong> button, you indicate that you understand and agree to
              the above-mentioned risks and terms.
            </Typography>
          </Box>

          {/* Confirm Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
              color: "#fff",
              fontWeight: 700,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              mb: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
                boxShadow: "0 8px 24px rgba(59, 164, 255, 0.3)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            CONFIRM & CONTINUE
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              color: "#113264",
              borderColor: "#113264",
              fontWeight: 600,
              py: 1.2,
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f0f6ff",
                borderColor: "#113264",
              },
            }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Address Modal - shown after confirm */}
      <DepositAddressModal
        open={addressModalOpen}
        onClose={handleAddressModalClose}
        method={method}
      />
    </>
  );
};

export default DepositModal;
