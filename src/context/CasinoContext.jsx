import React, { createContext, useState, useContext } from 'react';

const CasinoContext = createContext();

export const useCasino = () => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error('useCasino must be used within CasinoProvider');
  }
  return context;
};

export const CasinoProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const updateBalance = (amount) => {
    setBalance(prev => prev + amount);
  };

  const playGame = (gameId, betAmount) => {
    const isWin = Math.random() > 0.5;
    const winAmount = isWin ? betAmount * 2 : -betAmount;
    
    updateBalance(winAmount);
    
    const gameResult = {
      id: Date.now(),
      gameId,
      betAmount,
      winAmount,
      isWin,
      timestamp: new Date()
    };
    
    setGameHistory(prev => [gameResult, ...prev]);
    return gameResult;
  };

  const value = {
    balance,
    updateBalance,
    selectedGame,
    setSelectedGame,
    gameHistory,
    playGame
  };

  return (
    <CasinoContext.Provider value={value}>
      {children}
    </CasinoContext.Provider>
  );
};