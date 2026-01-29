import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import DepositPage from './DepositPage';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: '',
    walletAddress: '',
    note: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.amount || !formData.firstName || !formData.email) {
      setSnackMessage('Please fill in all required fields.');
      setSnackSeverity('error');
      setOpenSnack(true);
      return false;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
        setSnackMessage('Please fill in all card details.');
        setSnackSeverity('error');
        setOpenSnack(true);
        return false;
      }
      // Basic card number validation (Luhn algorithm simplified)
      if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        setSnackMessage('Invalid card number.');
        setSnackSeverity('error');
        setOpenSnack(true);
        return false;
      }
    }

    if (paymentMethod === 'crypto' && !formData.walletAddress) {
      setSnackMessage('Please enter your wallet address.');
      setSnackSeverity('error');
      setOpenSnack(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would send the payment data to your backend
      console.log('Payment submitted:', formData);

      setSnackMessage('Payment processed successfully! Thank you for your transaction.');
      setSnackSeverity('success');
      setOpenSnack(true);

      // Reset form
      setFormData({
        amount: '',
        currency: 'USD',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingCountry: '',
        walletAddress: '',
        note: '',
      });
    } catch (error) {
      setSnackMessage('Payment failed. Please try again.');
      setSnackSeverity('error');
      setOpenSnack(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange({ target: { name: 'cardNumber', value: formatted } });
  };

  return (
    <>
      <Header />
      <DepositPage/>

      <Footer />
    </>
  );
};

export default Payment;
