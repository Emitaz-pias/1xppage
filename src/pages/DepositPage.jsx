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
  TextField,
  Alert,
  Snackbar,
  Container,
  Chip,
  Divider,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import countriesData from "../data/countriesData.json";
import DepositModal from "../components/DepositModal/DepositModal";
import logo from "../images/logo.png";

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
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 12) {
      setPasswordError("Choose a new password with at least 12 characters.");
      return;
    }

    setPasswordSaving(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      closePasswordDialog();
      setPasswordSuccess(result.message);
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const closePasswordDialog = () => {
    setChangePasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
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

  const handleDepositSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Request simulated. No payment was sent, verified, or credited.");
      handleModalClose();
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f4f7fb", color: "#14233b" }}>
      <Box
        component="header"
        sx={{
          background: "#101d32",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            minHeight: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box component="img" src={logo} alt="1xBet" sx={{ width: 116, height: "auto" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
                Agent account
              </Typography>
              <Typography sx={{ color: "#9eacc1", fontSize: "0.76rem" }}>
                ID {user?.userId}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={() => setChangePasswordOpen(true)}
              sx={{
                color: "#d9e3f2",
                borderColor: "rgba(217,227,242,0.22)",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { borderColor: "#9db6d9", background: "rgba(255,255,255,0.06)" },
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Password
              </Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "#d9e3f2",
                borderColor: "rgba(217,227,242,0.22)",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { borderColor: "#9db6d9", background: "rgba(255,255,255,0.06)" },
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Logout
              </Box>
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 4,
            mb: { xs: 3, md: 4 },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, md: 4 },
            color: "#fff",
            background: "linear-gradient(115deg, #122846 0%, #173c68 58%, #1e5680 100%)",
            boxShadow: "0 20px 50px rgba(20, 48, 82, 0.18)",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 330,
              height: 330,
              right: { xs: -190, md: 90 },
              top: -210,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 0 38px rgba(255,255,255,0.025), 0 0 0 78px rgba(255,255,255,0.02)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
            <Chip
              icon={<ShieldOutlinedIcon sx={{ color: "#a5e4c3 !important", fontSize: 17 }} />}
              label="SECURE AGENT PORTAL"
              size="small"
              sx={{
                mb: 2,
                color: "#d7f5e5",
                background: "rgba(165,228,195,0.12)",
                border: "1px solid rgba(165,228,195,0.22)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: "0.68rem",
              }}
            />
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "2rem", md: "2.65rem" }, fontWeight: 750, letterSpacing: "-0.04em", mb: 1 }}
            >
            Welcome back{user?.name ? `, ${user.name}` : ""}
            </Typography>
            <Typography sx={{ color: "#c0cde0", fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7 }}>
              Choose a payment method to add funds to your agent account.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#d4deed" }}>
                <ShieldOutlinedIcon sx={{ color: "#9fe1ba", fontSize: 19 }} />
                <Typography variant="body2">Secure payments</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#d4deed" }}>
                <ScheduleRoundedIcon sx={{ color: "#9fe1ba", fontSize: 19 }} />
                <Typography variant="body2">Fast processing</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              flexShrink: 0,
              minWidth: { xs: 0, sm: 220 },
              width: { xs: "100%", sm: "auto" },
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#c0cde0", mb: 1.25 }}>
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Available balance</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: "1.75rem", sm: "2rem" }, fontWeight: 750, letterSpacing: "-0.035em" }}>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((user?.balanceCents || 0) / 100)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#aebed3", display: "block", mt: 0.5 }}>
              Account ID: {user?.userId}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
            p: { xs: 2, sm: 2.5 },
            background: "#fff",
            border: "1px solid #e7edf5",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(24,48,78,0.04)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ display: "block", color: "#8290a3", fontWeight: 700, letterSpacing: "0.08em", mb: 0.6 }}>
                PAYMENT REGION
              </Typography>
              <Select
                value={selectedCountry}
                size="small"
                onChange={handleCountryChange}
                sx={{
                  minWidth: { xs: "100%", sm: 250 },
                  borderRadius: 2,
                  background: "#fff",
                  fontWeight: 600,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e1e8f0" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8da7c6" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#315b88" },
                }}
              >
                {countriesData.map((country) => (
                  <MenuItem key={country.iso_code} value={country.iso_code}>
                    {country.flag_url && (
                      <img
                        src={country.flag_url}
                        alt={country.country_name}
                        style={{ width: "20px", height: "15px", marginRight: "8px" }}
                      />
                    )}
                    {country.country_name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" }, width: "1px", height: 42, background: "#e8edf4" }} />
            <Box>
              <Typography variant="caption" sx={{ display: "block", color: "#8290a3", fontWeight: 700, letterSpacing: "0.08em", mb: 0.6 }}>
                TRANSACTION TYPE
              </Typography>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  minHeight: 40,
                  "& .MuiTabs-indicator": { height: 2, borderRadius: 2, backgroundColor: "#315b88" },
                  "& .MuiTab-root": {
                    minHeight: 40,
                    px: 2,
                    color: "#8390a1",
                    fontWeight: 700,
                    textTransform: "none",
                    "&.Mui-selected": { color: "#183758" },
                  },
                }}
              >
                <Tab label="Deposit" />
                <Tab disabled label="Withdrawal" />
              </Tabs>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: "#8190a3" }}>
            Showing options for <Box component="span" sx={{ color: "#344961", fontWeight: 700 }}>{selectedCountryData?.country_name}</Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 0.5, mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: "#172b46", fontWeight: 750, letterSpacing: "-0.025em" }}>
              Choose a payment method
            </Typography>
            <Typography variant="body2" sx={{ color: "#8290a3", mt: 0.5 }}>
              Select your preferred way to fund your account.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#748398", fontWeight: 600 }}>
            {paymentMethods.length} available methods
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ width: "100%" }}>
        {paymentMethods.map((method) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={method.name}>
            <Card 
              variant="outlined"
              sx={{
                background: "#fff",
                border: "1px solid #e5ebf3",
                borderRadius: 3,
                height: "100%",
                minHeight: 260,
                transition: "all 0.25s ease",
                "&:hover": {
                  borderColor: "#a7bad1",
                  boxShadow: "0 16px 36px rgba(24,48,78,0.1)",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: { xs: 2, sm: 2.5 },
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f4f7fb",
                        borderRadius: 2,
                        padding: "9px",
                        border: "1px solid #edf1f6",
                      }}
                    >
                      <img
                        src={method.icon}
                        alt={method.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </Box>
                    <Typography
                      fontWeight="700"
                      variant="subtitle1"
                      sx={{ color: "#1c304a", lineHeight: 1.35 }}
                    >
                      {method.name}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={method.type === "crypto" ? "Crypto" : "Global"}
                    sx={{
                      flexShrink: 0,
                      color: method.type === "crypto" ? "#34734a" : "#536982",
                      background: method.type === "crypto" ? "#edf7f0" : "#f1f4f8",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor: "#edf1f6" }} />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#8290a3", fontWeight: 600 }}>
                      MINIMUM
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#344961", fontWeight: 700, mt: 0.3 }}>
                      {method.min}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#8290a3", fontWeight: 600 }}>
                      MAXIMUM
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#344961", fontWeight: 700, mt: 0.3 }}>
                      {method.max}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#8190a3", mt: "auto" }}>
                  <ScheduleRoundedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.84rem" }}>
                    Processing time: {method.time}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  disabled={method.disabled}
                  onClick={() => handleDepositClick(method)}
                  endIcon={<ArrowForwardRoundedIcon />}
                  fullWidth
                  sx={{
                    background: method.disabled 
                      ? "#ccc" 
                      : "#183758",
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderRadius: 2,
                    px: 1.8,
                    py: 1,
                    textTransform: "none",
                    opacity: method.disabled ? 0.6 : 1,
                    cursor: method.disabled ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": !method.disabled && {
                      background: "#254f78",
                      boxShadow: "0 7px 16px rgba(24,55,88,0.18)",
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
      </Container>

      {/* Deposit Modal */}
      <DepositModal 
        open={modalOpen}
        onClose={handleModalClose}
        method={selectedMethod}
        onSubmit={handleDepositSubmit}
        loading={loading}
      />

      <Dialog open={changePasswordOpen} onClose={closePasswordDialog} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleChangePassword}>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              helperText="Use at least 12 characters."
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closePasswordDialog} disabled={passwordSaving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={passwordSaving || Boolean(passwordSuccess)}>
              {passwordSaving ? "Saving…" : "Save password"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        open={Boolean(passwordSuccess)}
        autoHideDuration={3000}
        onClose={() => setPasswordSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setPasswordSuccess("")}>
          {passwordSuccess}
        </Alert>
      </Snackbar>

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
