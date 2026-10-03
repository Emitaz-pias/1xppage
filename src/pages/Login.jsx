import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.png";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!userId || !password || (isRegistering && !confirmPassword)) {
      setError("Please complete all fields.");
      setLoading(false);
      return;
    }

    // User ID must be exactly 9 digits (numeric only)
    const userIdPattern = /^\d{9}$/;
    if (!userIdPattern.test(userId)) {
      setError("User ID must be a 9-digit number (digits only)");
      setLoading(false);
      return;
    }

    if (isRegistering && password.length < 12) {
      setError("Choose a password with at least 12 characters.");
      setLoading(false);
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let account;
      if (isRegistering) {
        account = await register({ userId, password });
      } else {
        account = await login({ userId, password });
      }
      navigate(account.role === "admin" ? "/admin" : "/payment");
    } catch (authError) {
      setError(authError.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a3a5c 0%, #2d5a8c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: { xs: 1, sm: 2 },
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: { xs: "100%", sm: "500px" }, width: "100%" }}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: "16px",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.5)",
            background: "linear-gradient(135deg, #364b61 0%, #122233 100%)",
            maxWidth: "100%",
            width: "100%",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 3,}}>
            <Box
              component="img"
              src={logo}
              alt="1xBet"
              sx={{ height: { xs: 35, sm: 40 }, mb: 2, cursor: "pointer" }}
            />
          </Box>

          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              mb: 1,
        
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Agent Portal
          </Typography>

          <Typography
            sx={{
              color: "#b0bec5",
              textAlign: "center",
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              mb: 3,
              fontWeight: 500,
            }}
          >
            Sign in to your account to manage deposits and withdrawals
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px", background: "#ffcdd2", color: "#c62828", border: "1px solid #ef5350" }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleAuth} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* User ID Field */}
            <TextField            
              label="User ID"
              type="text"
              placeholder="Enter your user ID"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  "& fieldset": {
                    borderColor: "rgba(59, 164, 255, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#3ba4ff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3ba4ff",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  color: "#113264",
                  padding: { xs: "10px 12px", sm: "12px 14px" },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: "#1e5a96",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type="password"
              placeholder="••••••••"
              fullWidth
              value={password}
              onChange={(e) => 
                setPassword(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  "& fieldset": {
                    borderColor: "rgba(59, 164, 255, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#3ba4ff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3ba4ff",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  color: "#113264",
                  padding: { xs: "10px 12px", sm: "12px 14px" },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: "#1e5a96",
                  },
                },
              }}
            />
            {isRegistering && (
              <TextField
                label="Confirm password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            )}
            {/* Login Button */}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #3ba4ff 0%, #2d7fb3 100%)",
                color: "#fff",
                fontWeight: 700,
                py: { xs: 1.2, sm: 1.3 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                borderRadius: "10px",
                transition: "all 0.3s ease",
                position: "relative",
                boxShadow: "0 8px 20px rgba(59, 164, 255, 0.3)",
                "&:hover": !loading && {
                  background: "linear-gradient(135deg, #2d7fb3 0%, #1a4a8c 100%)",
                  boxShadow: "0 12px 28px rgba(59, 164, 255, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  opacity: 0.8,
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                  <span>Logging in...</span>
                </Box>
              ) : (
                isRegistering ? "Create account" : "Login"
              )}
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsRegistering((current) => !current);
                setPassword("");
                setConfirmPassword("");
                setError("");
              }}
              sx={{ color: "#90caf9", textTransform: "none" }}
            >
              {isRegistering ? "Already have an account? Sign in" : "New here? Create an account"}
            </Button>
          </Box>

          {/* Footer Info */}
          
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
