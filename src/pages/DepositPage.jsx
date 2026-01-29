import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import countriesData from "../data/countriesData.json";
import DepositModal from "../components/DepositModal/DepositModal";

const paymentMethods = [
  

  // 🔥 Crypto methods
  {
    name: "USDT (BEP20)",
    min: "10 USDT",
    max: "Unlimited",
    time: "5–10 minutes",
    type: "crypto",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    name: "USDT (TRC20)",
    min: "10 USDT",
    max: "Unlimited",
    time: "1–5 minutes",
    type: "crypto",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    name: "Bitcoin (BTC)",
    min: "0.0005 BTC",
    max: "Unlimited",
    time: "10–30 minutes",
    type: "crypto",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    name: "Ethereum (ETH)",
    min: "0.01 ETH",
    max: "Unlimited",
    time: "5–15 minutes",
    type: "crypto",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "PayPal",
    min: "$10",
    max: "$10,000",
    time: "1–3 minutes",
    type: "international",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
  },
  {
    name: "Bank Transfer",
    min: "$20",
    max: "Unlimited",
    time: "1–3 business days",
    type: "international",
    icon: "https://cdn-icons-png.flaticon.com/512/636/636488.png",
  }
];

const DepositPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("BD");
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restrictionModalOpen, setRestrictionModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const selectedCountryData = countriesData.find(
    (country) => country.iso_code === selectedCountry
  );

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDepositClick = (method) => {
    // Check if method is PayPal or Bank Transfer
    if (method.name === "PayPal" || method.name === "Bank Transfer") {
      setRestrictionModalOpen(true);
      return;
    }
    setSelectedMethod(method);
    setModalOpen(true);
  };

  const handleRestrictionModalClose = () => {
    setRestrictionModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMethod(null);
  };

  const handleDepositSubmit = async (depositData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Deposit submitted:", depositData);
      // Handle success - show notification or redirect
      alert(`Deposit of ${depositData.amount} ${depositData.currency} initiated via ${depositData.method}`);
      handleModalClose();
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, background: "#f9fbff", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      {/* Header Section with Logout */}
      <Box 
        sx={{ 
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #113264 0%, #1a4a8c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
            }}
          >
            Deposit Funds
          </Typography>
          <Typography 
            sx={{
              color: "#666",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Select a payment system to top up your account
          </Typography>
          {user && (
            <Typography 
              sx={{
                color: "#3ba4ff",
                fontSize: "0.9rem",
                fontWeight: 600,
                mt: 1,
              }}
            >
              Agent ID: {user.userId}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: "#113264",
            borderColor: "#113264",
            fontWeight: 600,
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f0f6ff",
              borderColor: "#113264",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Country + Tabs Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 2 },
          mb: 4,
          p: { xs: 1.5, sm: 2 },
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          width: "100%",
        }}
      >
        <Select 
          value={selectedCountry} 
          size="small"
          onChange={handleCountryChange}
          sx={{ 
            minWidth: { xs: "100%", sm: 250 },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3ba4ff",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#113264",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#113264",
              borderWidth: 2,
            },
            fontWeight: 500,
          }}
        >
          {countriesData.map((country) => (
            <MenuItem key={country.iso_code} value={country.iso_code}>
              {country.flag_url && (
                <img
                  src={country.flag_url}
                  alt={country.country_name}
                  style={{
                    width: "20px",
                    height: "15px",
                    marginRight: "8px",
                  }}
                />
              )}
              {country.country_name}
            </MenuItem>
          ))}
        </Select>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#3ba4ff",
              height: 3,
            },
            "& .MuiTab-root": {
              color: "#666",
              fontWeight: 600,
              fontSize: "1rem",
              "&.Mui-selected": {
                color: "#113264",
              },
            },
          }}
        >
          <Tab label="Deposit" />
          <Tab disabled='true' label="Withdrawal" />
        </Tabs>
      </Box>

      {/* Payment Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: "100%", overflow: "hidden" }}>
        {paymentMethods.map((method, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <Card 
              variant="outlined"
              sx={{
                background: "#fff",
                border: "2px solid #e8f0ff",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#3ba4ff",
                  boxShadow: "0 8px 24px rgba(59, 164, 255, 0.15)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                }}
              >
                {/* Logo/Icon */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #f0f6ff 0%, #e8f0ff 100%)",
                    borderRadius: "12px",
                    padding: "8px",
                    border: "2px solid #dde8f5",
                  }}
                >
                  <img
                    src={method.icon}
                    alt={method.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography 
                    fontWeight="700" 
                    variant="h6"
                    sx={{
                      color: "#113264",
                      mb: 1,
                    }}
                  >
                    {method.name}
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    <Typography 
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "#3ba4ff", fontWeight: 700 }}>Min:</span> {method.min}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "#3ba4ff", fontWeight: 700 }}>Max:</span> {method.max}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: "#888",
                      mt: 0.5,
                      fontSize: "0.85rem",
                    }}
                  >
                    ⏱ {method.time}
                  </Typography>

                  {method.type === "crypto" && (
                    <Typography
                      variant="caption"
                      sx={{ 
                        display: "block", 
                        mt: 0.8,
                        background: "#d4edda",
                        color: "#155724",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        width: "fit-content",
                      }}
                    >
                      🔐 Crypto Network
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  disabled={method.disabled}
                  onClick={() => handleDepositClick(method)}
                  sx={{
                    background: method.disabled 
                      ? "#ccc" 
                      : "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderRadius: "8px",
                    px: 2.5,
                    py: 1.2,
                    opacity: method.disabled ? 0.6 : 1,
                    cursor: method.disabled ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": !method.disabled && {
                      background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
                      boxShadow: "0 6px 20px rgba(59, 164, 255, 0.4)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {method.disabled ? "Coming Soon" : "Deposit"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Deposit Modal */}
      <DepositModal 
        open={modalOpen}
        onClose={handleModalClose}
        method={selectedMethod}
        onSubmit={handleDepositSubmit}
        loading={loading}
      />

      {/* Region Restriction Modal */}
      <Dialog 
        open={restrictionModalOpen} 
        onClose={handleRestrictionModalClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
          },
        }}
      >
        <DialogTitle 
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: "700",
            fontSize: "1.2rem",
            color: "#d32f2f",
            pb: 1,
          }}
        >
          <WarningIcon sx={{ fontSize: "1.8rem" }} />
          Not Available
        </DialogTitle>
        <DialogContent>
          <Typography 
            sx={{
              color: "#333",
              fontSize: "1rem",
              lineHeight: "1.6",
              mt: 1,
            }}
          >
            This payment method is not available in your region.
          </Typography>
          <Typography 
            sx={{
              color: "#666",
              fontSize: "0.95rem",
              mt: 2,
            }}
          >
            Please choose a different payment method to continue with your deposit.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pt: 2 }}>
          <Button 
            onClick={handleRestrictionModalClose}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "8px",
              px: 3,
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepositPage;
