import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, InputAdornment, Snackbar, Alert } from "@mui/material";
import countriesData from "./countriesData.json";

const SHEETDB_URL = "https://sheetdb.io/api/v1/87niarzqgrbfj";

export default function AgentFormSection() {
  const initial = {
    country: "country",
    region: "region",
    city: "city",
    firstName: "",
    email: "",
    phone: "",
    method: "method",
    message: ""
  };

  const [formData, setFormData] = useState(initial);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    // load countries from JSON
    setCountries(countriesData);
  }, []);

  useEffect(() => {
    // when selected country changes, update regions/cities and phone code
    const country = countries.find((c) => c.country_name === formData.country);
    if (country) {
      setRegions(country.divisions_or_regions || []);
      setCities(country.major_cities || []);
      setPhoneCode(country.phone_code || "");
      // reset region & city selectors and phone value
      setFormData((prev) => ({ ...prev, region: "region", city: "city", phone: "" }));
    } else {
      setRegions([]);
      setCities([]);
      setPhoneCode("");
    }
  }, [formData.country, countries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // minimal submission: send the current formData to SheetDB
    setSubmitting(true);
    try {
      const payload = {
        country: formData.country,
        region: formData.region,
        city: formData.city,
        firstName: formData.firstName,
        email: formData.email,
        phone: (phoneCode || "") + formData.phone,
        method: formData.method,
        message: formData.message,
      };

      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [payload] }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("SheetDB error:", res.status, text);
        throw new Error("Submit failed");
      }

      setOpenSnack(true);
      // reset form values to initial after successful submit
      setFormData(initial);
    } catch (err) {
      console.error(err);
      alert("Submit failed — please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box id="agent-form-section"
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '60vh', md: 'auto' },
        py: { xs: 4, md: 0 },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '70%' },
          backgroundColor: "transparent",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: "#0a1a3b", textAlign: 'center' }}>
          Become an Agent
        </Typography>

        {/* Row 1: Country + Region */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2.5 }}>
          <TextField 
            select 
            fullWidth 
            size="small" 
            name="country"
            value={formData.country}
            onChange={handleChange}
            variant="outlined"
           
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input": {
                color: formData.country === "country" ? "rgba(10, 26, 59, 0.7)" : "#0a1a3b"
              }
            }}
          >
            <MenuItem value="country" sx={{ color: "rgba(10, 26, 59, 0.7)" }}>Country</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c.iso_code} value={c.country_name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="img" src={c.flag_url} alt={c.iso_code} sx={{ width: 22, height: 14, objectFit: 'cover' }} />
                {`    ${c.country_name}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            select 
            fullWidth 
            size="small" 
            name="region"
            value={formData.region}
            onChange={handleChange}
            variant="outlined"          
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input": {
                color: formData.region === "region" ? "rgba(10, 26, 59, 0.7)" : "#0a1a3b"
              }
            }}
          >
            <MenuItem value="region" sx={{ color: "rgba(10, 26, 59, 0.7)" }}>Region</MenuItem>
            {regions.length > 0 ? regions.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            )) : <MenuItem value="none" disabled>No regions</MenuItem>}
          </TextField>
        </Box>

        {/* Row 2: City + First Name */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2.5 }}>
          <TextField 
            select 
            fullWidth 
            size="small" 
            name="city"
            value={formData.city}
            onChange={handleChange}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input": {
                color: formData.city === "city" ? "rgba(10, 26, 59, 0.7)" : "#0a1a3b"
              }
            }}
          >
            <MenuItem value="city" sx={{ color: "rgba(10, 26, 59, 0.7)" }}>City</MenuItem>
            {cities.length > 0 ? cities.map((ct) => (
              <MenuItem key={ct} value={ct}>{ct}</MenuItem>
            )) : <MenuItem value="none" disabled>No cities</MenuItem>}
          </TextField>

          <TextField 
            fullWidth 
            size="small" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#0a1a3b",
                opacity: 0.7
              }
            }}
          />
        </Box>

        {/* Row 3: Email + Phone */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2.5 }}>
          <TextField 
            fullWidth 
            size="small" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          placeholder="Email"
            type="email"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#0a1a3b",
                opacity: 0.7
              }
            }}
          />

          <TextField 
            fullWidth 
            size="small" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
             placeholder={phoneCode ? "" : "Phone"}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>{phoneCode}</InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0a1a3b",
                  borderWidth: "1.5px"
                },
                "&:hover fieldset": {
                  borderColor: "#0a1a3b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0a1a3b"
                }
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#0a1a3b",
                opacity: 0.7
              }
            }}
          />
        </Box>

        {/* Row 4: Method of Contact (Full width) */}
        <TextField
          select
          fullWidth
          size="small"
          name="method"
          value={formData.method}
          onChange={handleChange}
          variant="outlined"
          
          sx={{ 
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#0a1a3b",
                borderWidth: "1.5px"
              },
              "&:hover fieldset": {
                borderColor: "#0a1a3b"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0a1a3b"
              }
            },
            "& .MuiInputBase-input": {
              color: formData.method === "method" ? "rgba(10, 26, 59, 0.7)" : "#0a1a3b"
            }
          }}
        >
          <MenuItem value="method" sx={{ color: "rgba(10, 26, 59, 0.7)" }}>Method of Contact</MenuItem>
           <MenuItem value="telegram">Telegram</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="phone">Whatsapp</MenuItem>
         
        </TextField>

        {/* Row 5: Your Message */}
        <TextField
          fullWidth
          size="small"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          multiline
          rows={3}
          variant="outlined"
          sx={{ 
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#0a1a3b",
                borderWidth: "1.5px"
              },
              "&:hover fieldset": {
                borderColor: "#0a1a3b"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0a1a3b"
              }
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#0a1a3b",
              opacity: 0.7
            }
          }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={submitting}
          sx={{
            backgroundColor: "#00853a",
            fontWeight: 700,
            textTransform: "none",
            fontSize: 15,
            py: 1,
            "&:hover": { backgroundColor: "#1a2a4b" },
          }}
        >
          {submitting ? "SENDING..." : "SEND"}
        </Button>

        <Snackbar open={openSnack} autoHideDuration={4000} onClose={() => setOpenSnack(false)}>
          <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenSnack(false)}>
            Request sent — we'll contact you shortly.
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
