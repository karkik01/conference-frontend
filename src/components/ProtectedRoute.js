// ==========================================
// ProtectedRoute.js — Restrict admin pages
// ==========================================
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

function ProtectedRoute({ children, adminOnly = false }) {
  const [authStatus, setAuthStatus] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setAuthStatus("denied");
      return;
    }

    // Validate user token + role
    API.get("current_user/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (adminOnly && !res.data.is_staff) {
          setAuthStatus("denied");
        } else {
          setAuthStatus("allowed");
        }
      })
      .catch(() => setAuthStatus("denied"));
  }, [adminOnly]);

  if (authStatus === "checking") return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (authStatus === "denied") return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
