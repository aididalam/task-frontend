import React, { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";

// Create the AuthContext
const AuthContext = createContext();

// Helper function to get auth state from localStorage
const getAuthState = () => {
  const authState = localStorage.getItem("authState");
  return authState ? JSON.parse(authState) : null;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getAuthState());
  const { fetchApi } = useApi();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [intervalTime, setIntervalTime] = useState(1); // Start with 1s interval

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!authState || !authState.expires_in) {
        setIsAuthReady(true);
        return;
      }

      const expirationTime = authState.expires_in; // Stored as timestamp
      const timeLeft = expirationTime - Date.now();

      // Refresh the token 5 minutes before expiry
      if (timeLeft < 5 * 60 * 1000 && authState.access_token) {
        const response = await fetchApi("/refresh", "POST", {
          headers: { Authorization: `Bearer ${authState.access_token}` },
          body: {}
        });

        if (response?.access_token) {
          const newExpirationTime = Date.now() + response.expires_in * 1000; // Convert to timestamp

          const newAuthState = {
            access_token: response.access_token,
            expires_in: newExpirationTime,
            user: authState.user // Keep user data unchanged
          };

          localStorage.setItem("authState", JSON.stringify(newAuthState));
          setAuthState(newAuthState);
        } else {
          localStorage.removeItem("authState");
          setAuthState(null);
        }
      }

      setIsAuthReady(true);
    };

    const interval = setInterval(checkAndRefreshToken, intervalTime * 1000);

    return () => clearInterval(interval);
  }, [authState, fetchApi, intervalTime]);

  useEffect(() => {
    if (isAuthReady) {
      setIntervalTime(60); // Set interval to 60 seconds after initial check
    }
  }, [isAuthReady]);

  const login = (data) => {
    const { access_token, expires_in, user } = data;
    const expirationTime = Date.now() + expires_in * 1000; // Convert to timestamp

    const updatedAuthState = {
      access_token,
      expires_in: expirationTime,
      user
    };

    localStorage.setItem("authState", JSON.stringify(updatedAuthState));
    setAuthState(updatedAuthState);
  };

  const logout = () => {
    localStorage.removeItem("authState");
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAuthReady }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
