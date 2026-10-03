import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;



async function authRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed. Please try again.');
  }

  return data;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authRequest('/api/auth/me')
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user?.userId) return undefined;
    const refresh = () => {
      authRequest('/api/auth/me')
        .then(({ user: currentUser }) => setUser(currentUser))
        .catch(() => {});
    };
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, [user?.userId]);

  const refreshUser = async () => {
    const data = await authRequest('/api/auth/me');
    setUser(data.user);
    return data.user;
  };

  const login = async (credentials) => {
    const data = await authRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setUser(data.user);
    return data.user;
  };

  const register = async (account) => {
    const data = await authRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(account),
    });
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (passwords) => {
    const data = await authRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    changePassword,
    logout,
    refreshUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
