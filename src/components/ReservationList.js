// ==========================================================
// ReservationList.js — User Reservation Management (FIXED)
// ==========================================================

import React, { useEffect, useState } from "react";

import {
  getReservations,
  createReservation,
} from "../api"; // ✅ FIXED IMPORTS

import api from "../api"; // ↳ For delete + update (using axios instance)

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
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

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
      const data = await getReservations(); // ✅ FIXED
      setReservations(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load reservations", "error");
    }
  };

  // ✅ Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✏️ Open edit dialog
  const handleEdit = (reservation) => {
    setSelectedRes(reservation);
    setForm({
      date: reservation.date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    });
    setEditDialog(true);
  };

  // ✏️ Submit edited reservation
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/api/reservations/${selectedRes.id}/`,
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
      await api.delete(`/api/reservations/${id}/`, { headers });
      showSnackbar("Reservation cancelled", "info");
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

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Reservation</DialogTitle>

        <DialogContent>
          <form onSubmit={handleEditSubmit}>
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

          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
