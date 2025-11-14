// ===============================================
// API.js — Axios Instance (Vercel Compatible)
// ===============================================

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://conferencehub-backend.onrender.com/api/",
  timeout: 10000,
});

// 🔐 Attach JWT token automatically (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
