import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QRCode from "react-qr-code";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Network configurations with addresses
const networkConfigs = {
  "USDT (BEP20)": {
    address: "0x1c7268fc8acc2fa24274351881f0b16b0eb29f12",
    network: "BEP20 (Binance Smart Chain)",
    minAmount: "15.00 USDT",
    exchangeRate: "1 USDT = 1 USD",
    icons: [
      { src: "https://cryptologos.cc/logos/tether-usdt-logo.png", alt: "USDT" },
      { src: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png", alt: "BNB" },
    ],
    warnings: [
      "✗ Do NOT use ERC20, TRC20, OMNI, SOL, or other networks",
      "✗ ONLY use Binance Smart Chain (BEP20) network",
      "✗ Do NOT use contract addresses",
    ],
  },
  "USDT (TRC20)": {
    address: "TDQ9cvPvTqo9DyAekkZYNejL49USk3DFwd",
    network: "TRC20 (TRON Network)",
    minAmount: "15.00 USDT",
     exchangeRate: "1 USDT = 1 USD",
    icons: [
      { src: "https://cryptologos.cc/logos/tether-usdt-logo.png", alt: "USDT" },
      { src: "https://cryptologos.cc/logos/tron-trx-logo.png", alt: "TRON" },
    ],
    warnings: [
      "✗ Do NOT use ERC20, BEP20, OMNI, SOL, or other networks",
      "✗ ONLY use TRON (TRC20) network",
      "✗ Do NOT use contract addresses",
    ],
  },
  "Bitcoin (BTC)": {
    address: "13HGum93XmfRzfTyAFhaAMoaqsWmLHgYFY",
    network: "Bitcoin Network",
    minAmount: "0.0005 BTC",
    exchangeRate: "1 BTC = 90,224.50 USD",
    icons: [
      { src: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", alt: "BTC" },
    ],
    warnings: [
      "✗ ONLY send Bitcoin to this address",
      "✗ Do NOT use Segwit (P2SH) or other Bitcoin address formats",
      "✗ Do NOT use contract addresses",
    ],
  },
  "Ethereum (ETH)": {
    address: "0x1c7268fc8acc2fa24274351881f0b16b0eb29f12",
    network: "Ethereum Network (ERC20)",
    minAmount: "0.01 ETH",
    exchangeRate: "1 ETH = 150,000.00 BDT",
    icons: [
      { src: "https://cryptologos.cc/logos/ethereum-eth-logo.png", alt: "ETH" },
    ],
    warnings: [
      "✗ ONLY send ETH or ERC20 tokens to this address",
      "✗ Do NOT use other networks",
      "✗ Do NOT use contract addresses",
    ],
  },
};

const DepositAddressModal = ({ open, onClose, method }) => {
  const [copied, setCopied] = React.useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
  const [exchangeRates, setExchangeRates] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  // Fetch live exchange rates from CoinGecko API
  React.useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether,ethereum,bitcoin&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false"
        );
        const data = await response.json();
        
        setExchangeRates({
          USDT: data.tether?.usd || 1,
          ETH: data.ethereum?.usd || 0,
          BTC: data.bitcoin?.usd || 0,
        });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        // Fallback to default rates if API fails
        setExchangeRates({
          USDT: 1,
          ETH: 150000,
          BTC: 2755224.50,
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchExchangeRates();
    }
  }, [open]);

  // Get available networks for this method
  const getAvailableNetworks = () => {
    if (!method) return [];
    const methodName = method.name;
    
    // Return only the exact method clicked, not all variants
    if (methodName === "USDT (BEP20)") {
      return ["USDT (BEP20)"];
    } else if (methodName === "USDT (TRC20)") {
      return ["USDT (TRC20)"];
    } else if (methodName === "Bitcoin (BTC)") {
      return ["Bitcoin (BTC)"];
    } else if (methodName === "Ethereum (ETH)") {
      return ["Ethereum (ETH)"];
    }
    return [];
  };

  const availableNetworks = getAvailableNetworks();
  const selectedNetwork = availableNetworks[selectedTabIndex] || availableNetworks[0];
  const config = networkConfigs[selectedNetwork];

  const handleCopy = () => {
    navigator.clipboard.writeText(config.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  const getExchangeRateDisplay = () => {
    const selectedNetwork = availableNetworks[selectedTabIndex] || availableNetworks[0];
    
    if (selectedNetwork.includes("USDT")) {
      const rate = exchangeRates.USDT || 1;
      return `1 USDT = $${rate.toFixed(2)} USD`;
    } else if (selectedNetwork.includes("Bitcoin")) {
      const rate = exchangeRates.BTC || 0;
      return `1 BTC = $${rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD`;
    } else if (selectedNetwork.includes("Ethereum")) {
      const rate = exchangeRates.ETH || 0;
      return `1 ETH = $${rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD`;
    }
    return config.exchangeRate;
  };

  if (!method || !config) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          margin: { xs: "16px", sm: "32px" },
          maxHeight: "calc(100vh - 32px)",
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, position: "relative", background: "#f9fbff", overflow: "auto" }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#113264",
            "&:hover": { backgroundColor: "#e8f0ff" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Title */}
        <Typography
          sx={{
            fontSize: "1.4rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #113264 0%, #1a4a8c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 2,
            textAlign: "center",
          }}
        >
          Send Your Deposit
        </Typography>

        {/* Crypto Icons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          {config.icons.map((icon) => (
            <Box
              key={icon.alt}
              sx={{
                width: 60,
                height: 60,
                background: "linear-gradient(135deg, #f0f6ff 0%, #e8f0ff 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #3ba4ff",
              }}
            >
              <img src={icon.src} width={40} alt={icon.alt} />
            </Box>
          ))}
        </Box>

        {/* Network Tabs */}
        {availableNetworks.length > 1 && (
          <Tabs
            value={selectedTabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              "& .MuiTabs-indicator": {
                backgroundColor: "#3ba4ff",
              },
              "& .MuiTab-root": {
                fontWeight: 600,
                color: "#888",
                fontSize: "0.9rem",
                "&.Mui-selected": {
                  color: "#113264",
                },
              },
            }}
          >
            {availableNetworks.map((network) => (
              <Tab key={network} label={network} />
            ))}
          </Tabs>
        )}

        {/* Exchange Rate */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            p: 1.5,
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "2px solid #e8f0ff",
          }}
        >
          <Typography sx={{ color: "#888", fontSize: "0.85rem", mb: 0.5 }}>
            Exchange Rate (Live)
          </Typography>
          <Typography
            sx={{
              color: "#113264",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Loading..." : getExchangeRateDisplay()}
          </Typography>
        </Box>

        {/* Address Section */}
        <Typography
          sx={{
            color: "#113264",
            fontWeight: 600,
            fontSize: "0.95rem",
            mb: 1.5,
          }}
        >
          📋 Deposit Address ({config.network})
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            backgroundColor: "#fff",
            border: "2px solid #3ba4ff",
            borderRadius: "8px",
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#113264",
              fontWeight: 600,
              flex: 1,
              wordBreak: "break-all",
              fontFamily: "monospace",
            }}
          >
            {config.address}
          </Typography>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: "#3ba4ff",
              flexShrink: 0,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#e8f0ff",
                color: "#113264",
              },
            }}
            title="Copy address"
          >
            {copied ? (
              <CheckCircleIcon fontSize="small" sx={{ color: "#4caf50" }} />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        {/* QR Code */}
        <Typography
          sx={{
            color: "#113264",
            fontWeight: 600,
            fontSize: "0.95rem",
            mb: 1.5,
          }}
        >
          📱 QR Code
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            p: 2,
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "2px solid #e8f0ff",
          }}
        >
          <Box sx={{ p: 1.5, background: "#fff" }}>
            <QRCode value={config.address} size={160} />
          </Box>
        </Box>

        {/* Warning Info Box */}
        <Box
          sx={{
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            color: "#856404",
            p: 2,
            borderRadius: "8px",
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1, fontSize: "0.95rem" }}>
            ⚠️ Important Notice
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", mb: 1, lineHeight: 1.5 }}>
            Minimum deposit amount: <strong>{config.minAmount}</strong>
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
            If you transfer below the limit, your funds will be lost. Please note that the
            exchange rate may differ slightly at transaction completion.
          </Typography>
        </Box>

        {/* Error/Network Box */}
        <Box
          sx={{
            backgroundColor: "#f8d7da",
            border: "2px solid #f5c6cb",
            color: "#721c24",
            p: 2,
            borderRadius: "8px",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1, fontSize: "0.95rem" }}>
            ❌ Network Guidelines
          </Typography>
          <Stack spacing={0.5}>
            {config.warnings.map((warning) => (
              <Typography key={warning} sx={{ fontSize: "0.85rem" }}>
                {warning}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* Confirm Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
            color: "#fff",
            fontWeight: 700,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
              boxShadow: "0 8px 24px rgba(59, 164, 255, 0.3)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
          onClick={handleClose}
        >
          I Understand & Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositAddressModal;
