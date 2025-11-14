// ===================================================
// RoomList.js — Room Reservation Page (FIXED)
// ===================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../API"; // ✅ FIXED IMPORT

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import "../styles/rooms.css";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ date: "", start_time: "", end_time: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // 🔄 Fetch rooms
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const res = await api.get("rooms/"); // 🔥 FIXED
        setRooms(res.data);
      } catch (err) {
        console.error("Error loading rooms:", err);
        showSnackbar("Failed to load rooms", "error");
      }
    };

    fetchRoomsData();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 📝 Create reservation
  const handleReserve = async (e) => {
    e.preventDefault();

    if (!form.date || !form.start_time || !form.end_time) {
      showSnackbar("All fields required", "warning");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "reservations/",
        {
          room_id: selectedRoom.id,
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSnackbar("Room reserved successfully!");
      setTimeout(() => navigate("/reservations"), 1200);

      setSelectedRoom(null);
      setForm({ date: "", start_time: "", end_time: "" });
    } catch (err) {
      console.error("Reservation error:", err.response?.data || err.message);
      showSnackbar("Reservation failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rooms-page">
      <div className="rooms-container">
        <h2>Available Rooms</h2>

        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              <p>
                <b>Capacity:</b> {room.capacity}
              </p>
              <p>
                <b>Location:</b> {room.location}
              </p>

              <button
                className="reserve-btn"
                onClick={() => setSelectedRoom(room)}
              >
                Reserve
              </button>
            </div>
          ))
        )}
      </div>

      {/* Reservation Dialog */}
      <Dialog
        open={!!selectedRoom}
        onClose={() => !loading && setSelectedRoom(null)}
      >
        <DialogTitle>Reserve {selectedRoom?.name}</DialogTitle>

        <DialogContent>
          <form className="reserve-form" onSubmit={handleReserve}>
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
            />

            <TextField
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
            />

            <TextField
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => !loading && setSelectedRoom(null)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleReserve}
          >
            {loading ? "Reserving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
