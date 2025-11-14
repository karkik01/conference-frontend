// =============================================
// AdminPanel.js — Futuristic Admin Dashboard (FIXED)
// =============================================

import React, { useState, useEffect } from "react";

import api from "../api";   // ✅ FIXED IMPORT

import {
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "../styles/admin.css";

export default function AdminPanel() {
  const [tab, setTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", capacity: "" });
  const [editingRoom, setEditingRoom] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    id: null,
    message: "",
  });

  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  // 🔄 Load data when tab changes
  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    try {
      if (tab === "rooms") {
        const res = await api.get("/api/rooms/", { headers });
        setRooms(res.data);
      } else if (tab === "reservations") {
        const res = await api.get("/api/reservations/", { headers });
        setReservations(res.data);
      } else if (tab === "users") {
        const res = await api.get("/api/users/", { headers });
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      showSnackbar("Failed to load data", "error");
    }
  };

  // Snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ➕ Add / Edit Room
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/api/rooms/${editingRoom}/`, form, { headers });
        showSnackbar("Room updated successfully", "success");
      } else {
        await api.post("/api/rooms/", form, { headers });
        showSnackbar("Room added successfully", "success");
      }
      setForm({ name: "", location: "", capacity: "" });
      setEditingRoom(null);
      loadData();
    } catch (err) {
      showSnackbar("Error saving room", "error");
    }
  };

  const handleEditRoom = (room) => {
    setForm({
      name: room.name,
      location: room.location,
      capacity: room.capacity,
    });
    setEditingRoom(room.id);
  };

  // ❌ Delete Room
  const handleDeleteRoom = (id) => {
    setConfirmDialog({
      open: true,
      id,
      action: "deleteRoom",
      message: "Are you sure you want to delete this room?",
    });
  };

  // 🧾 Cancel reservation
  const cancelReservation = (id) => {
    setConfirmDialog({
      open: true,
      id,
      action: "cancelReservation",
      message: "Cancel this reservation?",
    });
  };

  // ❌ Delete user
  const handleDeleteUser = (id) => {
    setConfirmDialog({
      open: true,
      id,
      action: "deleteUser",
      message: "Are you sure you want to delete this user?",
    });
  };

  // 📌 Confirm modal action
  const handleConfirm = async () => {
    const { id, action } = confirmDialog;
    try {
      if (action === "deleteRoom") {
        await api.delete(`/api/rooms/${id}/`, { headers });
        showSnackbar("Room deleted successfully", "success");
      } else if (action === "cancelReservation") {
        await api.delete(`/api/reservations/${id}/`, { headers });
        showSnackbar("Reservation cancelled successfully", "info");
      } else if (action === "deleteUser") {
        await api.delete(`/api/users/${id}/`, { headers });
        showSnackbar("User deleted successfully", "info");
      }
      loadData();
    } catch (err) {
      showSnackbar("Action failed", "error");
    } finally {
      setConfirmDialog({ open: false, id: null, action: null, message: "" });
    }
  };

  // Reserve for user
  const handleReserveForUser = async (userId, roomId) => {
    const date = prompt("Enter date (YYYY-MM-DD):");
    const start = prompt("Start time (HH:MM):");
    const end = prompt("End time (HH:MM):");

    if (!date || !start || !end) {
      showSnackbar("All fields required", "warning");
      return;
    }

    try {
      await api.post(
        "/api/reservations/",
        {
          user: userId,
          room_id: roomId,
          date,
          start_time: start,
          end_time: end,
        },
        { headers }
      );
      showSnackbar("Reservation created!", "success");
      loadData();
    } catch (err) {
      showSnackbar("Failed to reserve", "error");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <div className="admin-actions">
            <button className={`admin-btn ${tab === "rooms" ? "active" : ""}`} onClick={() => setTab("rooms")}>
              Manage Rooms
            </button>
            <button className={`admin-btn ${tab === "reservations" ? "active" : ""}`} onClick={() => setTab("reservations")}>
              Reservations
            </button>
            <button className={`admin-btn ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
              Manage Users
            </button>
          </div>
        </div>

        {/* ROOMS TAB */}
        {tab === "rooms" && (
          <div className="admin-section">
            <h3>{editingRoom ? "Edit Room" : "Add Room"}</h3>

            <form onSubmit={handleRoomSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Room Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                required
              />

              <button type="submit">{editingRoom ? "Update Room" : "Add Room"}</button>
              {editingRoom && <button onClick={() => setEditingRoom(null)}>Cancel</button>}
            </form>

            <h3>Existing Rooms</h3>
            {rooms.map((r) => (
              <div key={r.id} className="admin-card">
                <b>{r.name}</b> — {r.location} ({r.capacity} ppl)
                <div className="table-action">
                  <button className="edit" onClick={() => handleEditRoom(r)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDeleteRoom(r.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {tab === "reservations" && (
          <div className="admin-section">
            <h3>All Reservations</h3>

            {reservations.map((r) => (
              <div key={r.id} className="admin-card">
                <p>
                  <b>User:</b> {r.user?.username}
                  <span style={{ color: "#00eaff", marginLeft: 8 }}>
                    ({r.user?.email})
                  </span>
                </p>

                <p>
                  <b>Room:</b> {r.room?.name}
                </p>

                <p>
                  <b>Date:</b> {r.date}
                </p>

                <p>
                  <b>Time:</b> {r.start_time} - {r.end_time}
                </p>

                <div className="table-action">
                  <button className="delete" onClick={() => cancelReservation(r.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="admin-section">
            <h3>All Users</h3>

            {users.map((u) => (
              <div key={u.id} className="admin-card">
                <p>
                  <b>{u.username}</b> — {u.email} ({u.is_staff ? "Admin" : "User"})
                </p>

                <div className="table-action">
                  <button className="delete" onClick={() => handleDeleteUser(u.id)}>
                    Delete
                  </button>

                  <button
                    className="edit"
                    onClick={() =>
                      handleReserveForUser(
                        u.id,
                        prompt("Enter room ID to reserve for user:")
                      )
                    }
                  >
                    Reserve for User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>Confirm Action</DialogTitle>

        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>

          <Button color="error" onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
