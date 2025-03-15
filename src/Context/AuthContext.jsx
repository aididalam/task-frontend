import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Helper functions for JWT token handling
const getAuthState = () => {
  const authState = localStorage.getItem("authState");
  return authState ? JSON.parse(authState) : null;
};

const refreshToken = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  if (response.ok) {
    const data = await response.json();
    // Save the new token and expiration time
    const authState = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      user: null // User data is not refreshed on token refresh
    };
    localStorage.setItem("authState", JSON.stringify(authState));
    return data.access_token;
  } else {
    // If refresh fails, clear storage and return null
    localStorage.removeItem("authState");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getAuthState());

  useEffect(() => {
    const checkAndRefreshToken = () => {
      if (!authState || !authState.expires_in) return;

      const expirationDate = new Date(authState.expires_in);
      const timeLeft = expirationDate - new Date();

      // Refresh the token 5 minutes before it expires
      if (timeLeft < 5 * 60 * 1000 && authState.access_token) {
        refreshToken().then((newToken) => {
          if (newToken) {
            setAuthState((prevState) => ({
              ...prevState,
              access_token: newToken
            }));
          }
        });
      }
    };

    const interval = setInterval(checkAndRefreshToken, 60 * 1000); // check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [authState]);

  const login = (data) => {
    const { access_token, expires_in, user } = data;
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);

    // Update the authState object and save it to localStorage
    const updatedAuthState = {
      access_token,
      expires_in: expirationDate,
      user
    };
    localStorage.setItem("authState", JSON.stringify(updatedAuthState));
    setAuthState(updatedAuthState);
  };

  const logout = () => {
    localStorage.removeItem("authState");
    setAuthState(null);
  };

  return <AuthContext.Provider value={{ authState, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
