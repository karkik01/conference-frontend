import React, { createContext, useState, useEffect } from "react";
import api from "./api";   // ✅ FIXED IMPORT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user details from backend if token exists
  const fetchUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) return setUser(null);

    try {
      const res = await api.get("/api/current_user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("User load error:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    fetchUser();
  };

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
