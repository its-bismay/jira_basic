import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode.default(token);
        // Get name from localStorage if available
        const storedName = localStorage.getItem("userName");
        setUser({
          email: decoded.email,
          _id: decoded._id,
          name: storedName || decoded.email?.split("@")[0] || "User",
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (userData, token) => {
    setUser({
      email: userData.email,
      _id: userData._id,
      name: userData.name || userData.email?.split("@")[0] || "User",
    });
    setToken(token);
    localStorage.setItem("token", token);
    if (userData.name) {
      localStorage.setItem("userName", userData.name);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
