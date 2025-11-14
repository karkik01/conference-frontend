// ===========================================
// App.js — Main Routing with Protected Routes + Admin Panel
// ===========================================

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import RoomList from "./components/RoomList";
import ReservationList from "./components/ReservationList";
import AdminPanel from "./components/AdminPanel"; // ✅ Admin Panel added
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Auth protection

function App() {
  return (
    <Router>
      {/* Global Navbar (visible on all pages) */}
      <Navbar />

      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<RoomList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 Protected Routes (User must be logged in) */}
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ReservationList />
            </ProtectedRoute>
          }
        />

        {/* 👑 Admin-only Route (Only for is_staff = true users) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 🧭 Fallback (404 or redirect) */}
        <Route path="*" element={<RoomList />} />
      </Routes>
    </Router>
  );
}

export default App;
