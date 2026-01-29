import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AppProviders } from './context';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CookiePolicy from './pages/CookiePolicy';
import Payment from './pages/Payment';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/cookie-policy" element={<CookiePolicy />} /> */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;