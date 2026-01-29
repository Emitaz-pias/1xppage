import React, { createContext, useState, useContext } from 'react';

const SportsContext = createContext();

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error('useSports must be used within SportsProvider');
  }
  return context;
};

export const SportsProvider = ({ children }) => {
  const [selectedSport, setSelectedSport] = useState('football');
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (match, betType, odds) => {
    const newItem = {
      id: Date.now(),
      match,
      betType,
      odds,
      timestamp: new Date()
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    selectedSport,
    setSelectedSport,
    matches,
    setMatches,
    liveMatches,
    setLiveMatches,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart
  };

  return (
    <SportsContext.Provider value={value}>
      {children}
    </SportsContext.Provider>
  );
};