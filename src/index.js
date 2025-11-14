// ============================================
// index.js — Dark Mode + Auth Context Integrated
// ============================================

import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { createAppTheme } from "./theme";
import { AuthProvider } from "./AuthContext"; // ✅ Added global auth
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./styles/global.css";

function Root() {
  // Read stored theme from localStorage or default to 'light'
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");

  // Generate theme dynamically
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Persist user choice
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ✅ AuthProvider wraps entire app for login/logout reactivity */}
      <AuthProvider>
        <App />
      </AuthProvider>

      {/* 🌙 / ☀️ Floating dark mode toggle */}
      <IconButton
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
        sx={{
          position: "fixed",
          bottom: 25,
          right: 25,
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: 3,
          "&:hover": { backgroundColor: "action.hover" },
          transition: "0.3s ease",
          zIndex: 2000,
        }}
      >
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
