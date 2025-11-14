// ===================================================
// RoomList.js — Fixed & Enhanced Room Reservation
// ===================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRooms,
  createReservation
} from "../api";   // ✅ FIXED IMPORTS

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

  // 🔄 Fetch rooms on mount
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const data = await getRooms();   // ✅ FIXED API CALL
        setRooms(data);
      } catch (err) {
        console.error("Error loading rooms:", err);
        setSnackbar({
          open: true,
          message: "Failed to load rooms",
          severity: "error",
        });
      }
    };
    fetchRoomsData();
  }, []);

  // ✅ Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ Handle Reservation Submit
  const handleReserve = async (e) => {
    e.preventDefault();

    if (!form.date || !form.start_time || !form.end_time) {
      showSnackbar("All fields required", "warning");
      return;
    }

    setLoading(true);
    try {
      await createReservation(              // ✅ FIXED API CALL
        {
          room_id: selectedRoom.id,
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
        },
        token
      );

      showSnackbar("✅ Room reserved successfully!");
      setTimeout(() => navigate("/reservations"), 1500);
      setSelectedRoom(null);
      setForm({ date: "", start_time: "", end_time: "" });
    } catch (err) {
      console.error("Reservation Error:", err.response?.data || err.message);
      showSnackbar("❌ Reservation failed", "error");
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
        PaperProps={{
          sx: {
            backgroundColor: "rgba(10,20,30,0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,255,255,0.2)",
            boxShadow: "0 0 25px rgba(0,255,255,0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #00ffff, #007bff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}
        >
          Reserve {selectedRoom?.name}
        </DialogTitle>

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
          <Button
            onClick={() => !loading && setSelectedRoom(null)}
            sx={{ color: "#00eaff" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReserve}
            disabled={loading}
            sx={{
              background: "linear-gradient(90deg, #007bff, #00ffff)",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                boxShadow: "0 0 12px rgba(0,255,255,0.6)",
              },
            }}
          >
            {loading ? "Reserving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            background: "rgba(10,25,30,0.95)",
            color: "#b9ffff",
            border: "1px solid rgba(0,255,255,0.3)",
            boxShadow: "0 0 12px rgba(0,255,255,0.25)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
