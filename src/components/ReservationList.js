// ==========================================================
// ReservationList.js — User Reservation Management
// ==========================================================

import React, { useEffect, useState } from "react";
import API from "../api";
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
import "../styles/reservations.css";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [form, setForm] = useState({ date: "", start_time: "", end_time: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  // 🔄 Load user's reservations
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const res = await API.get("reservations/", { headers });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load reservations", "error");
    }
  };

  // ✅ Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✏️ Edit reservation
  const handleEdit = (reservation) => {
    setSelectedRes(reservation);
    setForm({
      date: reservation.date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    });
    setEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `reservations/${selectedRes.id}/`,
        {
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
          room_id: selectedRes.room.id,
        },
        { headers }
      );
      showSnackbar("Reservation updated successfully!");
      setEditDialog(false);
      loadReservations();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update reservation", "error");
    }
  };

  // ❌ Cancel reservation
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await API.delete(`reservations/${id}/`, { headers });
      showSnackbar("Reservation cancelled successfully", "info");
      loadReservations();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to cancel reservation", "error");
    }
  };

  return (
    <div className="reservations-page">
      <div className="reservations-container">
        <h2>My Reservations</h2>

        {reservations.length === 0 ? (
          <p>No reservations yet.</p>
        ) : (
          reservations.map((r) => (
            <div key={r.id} className="reservation-card">
              <h3>{r.room?.name || "Unknown Room"}</h3>
              <p>
                <b>Date:</b> {r.date}
              </p>
              <p>
                <b>Time:</b> {r.start_time} - {r.end_time}
              </p>
              <div className="reservation-actions">
                <button className="edit" onClick={() => handleEdit(r)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleCancel(r.id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✏️ Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
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
          Edit Reservation
        </DialogTitle>

        <DialogContent>
          <form className="reserve-form" onSubmit={handleEditSubmit}>
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
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            sx={{
              background: "linear-gradient(90deg, #007bff, #00ffff)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar Notifications */}
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
