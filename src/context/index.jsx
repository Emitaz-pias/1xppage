import React from 'react';
import { AuthProvider } from './AuthContext';
import { SportsProvider } from './SportsContext';
import { CasinoProvider } from './CasinoContext';
import { ThemeProvider } from './ThemeContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SportsProvider>
          <CasinoProvider>
            {children}
          </CasinoProvider>
        </SportsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Export individual hooks for easy access
export { useAuth } from './AuthContext';
export { useSports } from './SportsContext';
export { useCasino } from './CasinoContext';
export { useThemeContext } from './ThemeContext';