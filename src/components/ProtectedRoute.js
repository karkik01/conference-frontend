// ==========================================
// ProtectedRoute.js — Restrict Admin/User Pages
// ==========================================

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../API"; // ✅ FIXED IMPORT

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [authStatus, setAuthStatus] = useState("checking");
  // values: checking | allowed | denied

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setAuthStatus("denied");
      return;
    }

    api
      .get("current_user/") // 🔥 NO /api/ prefix
      .then((res) => {
        if (adminOnly && !res.data.is_staff) {
          setAuthStatus("denied");
        } else {
          setAuthStatus("allowed");
        }
      })
      .catch(() => setAuthStatus("denied"));
  }, [adminOnly]);

  if (authStatus === "checking") {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (authStatus === "denied") {
    return <Navigate to="/login" />;
  }

  return children;
}
