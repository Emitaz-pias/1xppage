import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

const AuthContext = createContext(null);


const API_URL =
  'https://api.1xbet-payment.com';

// ============================================================
// API REQUEST
// ============================================================

async function authRequest(
  path,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      // Important for session cookie
      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Request failed. Please try again.'
    );
  }

  return data;
}


// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};


// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // CHECK EXISTING LOGIN SESSION
  // Runs ONLY ONCE when app loads.
  // No automatic refresh / polling.
  // ==========================================================

  useEffect(() => {
    let active = true;

    authRequest('/api/auth/me')
      .then(
        ({
          user: currentUser,
        }) => {
          if (active) {
            setUser(
              currentUser
            );
          }
        }
      )
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    credentials
  ) => {
    const data =
      await authRequest(
        '/api/auth/login',
        {
          method: 'POST',

          body: JSON.stringify(
            credentials
          ),
        }
      );

    setUser(data.user);

    return data.user;
  };


  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  const changePassword =
    async (passwords) => {
      const data =
        await authRequest(
          '/api/auth/change-password',
          {
            method: 'POST',

            body: JSON.stringify(
              passwords
            ),
          }
        );

      setUser(data.user);

      return data;
    };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    try {
      await authRequest(
        '/api/auth/logout',
        {
          method: 'POST',
        }
      );
    } finally {
      setUser(null);
    }
  };


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    user,

    isAuthenticated:
      Boolean(user),

    login,

    changePassword,

    logout,

    loading,
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};