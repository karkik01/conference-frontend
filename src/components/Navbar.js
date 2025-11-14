// ======================================================
// Navbar.js — Futuristic Notifications Dropdown (FIXED)
// ======================================================

import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

import api from "../api";   // ✅ FIXED IMPORT

import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (token) fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications/", { headers }); // ✅ FIXED
      const unread = res.data.filter((n) => !n.read);
      setNotifications(unread.slice(0, 5));
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔔 Mark all as read
  const markAllAsRead = async () => {
    try {
      for (const n of notifications) {
        await api.patch(
          `/api/notifications/${n.id}/`,
          { read: true },
          { headers }
        ); // ✅ FIXED
      }
      setNotifications([]);
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav-container">
      <div className="nav-logo" onClick={() => navigate("/")}>
        <span className="logo-text">ConferenceHub</span>
      </div>

      <div className="nav-links">
        <Link to="/">Rooms</Link>
        {user && <Link to="/reservations">My Reservations</Link>}
        {user?.is_staff && <Link to="/admin">Admin Panel</Link>}

        {/* 🔔 Notification Bell */}
        {user && (
          <div className="notification-container" ref={dropdownRef}>
            <Badge
              badgeContent={notifications.length}
              color="info"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              sx={{
                cursor: "pointer",
                "& .MuiBadge-badge": {
                  backgroundColor: "#00eaff",
                  color: "#000",
                  fontWeight: "bold",
                  boxShadow: "0 0 10px #00eaff",
                },
              }}
            >
              <NotificationsIcon sx={{ color: "#00eaff", fontSize: 28 }} />
            </Badge>

            {dropdownOpen && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button onClick={markAllAsRead}>Mark All Read</button>
                </div>

                {notifications.length === 0 ? (
                  <p className="no-notif">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      <p>{n.message}</p>
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {!user ? (
          <>
            <Link to="/login" className="nav-btn login">
              Login
            </Link>
            <Link to="/register" className="nav-btn register">
              Register
            </Link>
          </>
        ) : (
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
