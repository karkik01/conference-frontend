// =======================================
// AuthContext.js — Authentication Handler
// =======================================

import React, { createContext, useState, useEffect } from "react";
import api from "./API"; // ✅ CASE-SENSITIVE IMPORT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Fetch logged-in user details
  const fetchUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("current_user/"); // 🔥 NO /api/ prefix
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 Login user (store JWT)
  const login = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    fetchUser();
  };

  // 🚪 Logout user
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
