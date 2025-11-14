// ============================================
// theme.js — Dynamic Light / Dark Theme
// ============================================

import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#0055ff" },
          secondary: { main: "#00bcd4" },
          background: {
            default: "#f4f6f8",
            paper: "#ffffff",
          },
          text: {
            primary: "#111827",
            secondary: "#555",
          },
        }
      : {
          primary: { main: "#00bcd4" },
          secondary: { main: "#0055ff" },
          background: {
            default: "#0a0a0a",
            paper: "#121212",
          },
          text: {
            primary: "#e5e7eb",
            secondary: "#a1a1aa",
          },
        }),
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
  },
  shape: { borderRadius: 12 },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
