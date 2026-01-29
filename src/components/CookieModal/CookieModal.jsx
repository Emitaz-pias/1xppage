import React from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CookieModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: { xs: 2, md: 8 } }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 840,
          mx: 'auto',
          backgroundColor: '#fff',
          borderRadius: '12px',
          outline: 'none',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(10, 26, 59, 0.3)',
          border: '2px solid #0a1a3b',
          overflow: 'hidden',
          maxHeight: '80vh',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, backgroundColor: '#0a1a3b', color: '#fff', '&:hover': { backgroundColor: '#1a2a4b' } }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ p: { xs: 3, md: 4 }, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0a1a3b' }}>
            Cookie Policy
          </Typography>

          <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
{`INFORMATION STORED ON YOUR DEVICE

When accessing our services, with your consent we may store information on your device. This information is referred to as "cookies", which are small text files containing letters and numbers for recording your preferences. Cookies are stored on your device when you use our services while visiting our websites and online pages.

We also use local shared objects or "flash cookies". "Flash cookies" are similar to browser cookies. They allow us to remember your visits across our sites.

Neither cookies nor flash cookies can be used to access your device or use information on your computer.

We only use cookies and "flash cookies" for monitoring.

We only use these methods to track your use of our services by recording your preferences.

Cookies help us monitor traffic to our site, improve our services, make it easier for you to access them and increase your interest in these services.

We use flash cookies and other cookies to help us show you more relevant and targeted advertisements.

STRICTLY NECESSARY COOKIES

Strictly necessary cookies are used to allow users to navigate the website and use its features, such as accessing secure areas of the website or making financial transactions. Without these cookies, you would not be able to use our websites efficiently.

REGISTRATION PROCESS

These cookies will hold information collected during registration and will allow us to recognize you as a customer and provide you with the services you require. We may also use this data to better understand your online interests and preferences and to constantly enhance your visits to our platforms and use of our services.

OUR WEBSITE

We use cookies to collect information for visitors to our website.

We use cookies to collect information for visitors to our website. Our servers use three different types of cookies:

"Session-based" cookies: This type of cookie is only allocated to your computer for the duration of your visit to our website. A session-based cookie helps you navigate our website faster and, if you are a registered customer, allows us to give you information that is more relevant to you. This cookie automatically expires when you close your browser.

"Persistent" cookies: This type of cookie will remain on your computer for a set period of time, depending on the cookie. Flash cookies are also persistent.

"Analytical" cookies: This type of cookie allows us to recognize and count the number of visitors to our site and see how visitors use our content and services. This helps us improve the way our sites work by ensuring, for example, that you can log in and find what you are looking for easily.

You make a decision and you always have a choice of whether to accept or decline cookies.

Most web browsers automatically accept cookies but, if you prefer, you can modify your browser settings to manage your cookie files.

You can use your web browser to:

delete all cookies;

block all cookies;

allow all cookies;

block third-party cookies;

clear all cookies when the browser is closed;

open a "private browsing"/"incognito" session that allows you to browse the Internet without storing data locally;

install add-ons and plug-ins to extend browser options.

Where can I find information about managing cookies? You can modify your Flash Player settings to prevent the use of flash cookies. The settings manager of your Flash Player allows you to manage your preferences. If you choose to decline all cookies in the browser, unfortunately you will not be able to use some of the features and services on our websites and some services will not work correctly. For example, we will not be able to save your chosen interface language.

Information about cookies in Internet Explorer
Information about cookies in Chrome
Information about cookies in Firefox
Information about cookies in Safari
Information about cookies in Opera

FLASH COOKIE

You can modify your Flash Player settings to prevent the use of flash cookies. The settings manager of your Flash Player allows you to manage your preferences.

If you choose to decline all cookies in the browser, unfortunately you will not be able to use some of the features and services on our websites and some services will not work correctly. For example, we will not be able to save your chosen interface language.`}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default CookieModal;
