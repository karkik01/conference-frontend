// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------- AUTH ----------
export const loginUser = async (username, password) => {
  const response = await api.post("/api/token/", {
    username,
    password,
  });
  return response.data; // { access, refresh }
};

export const refreshToken = async (refresh) => {
  const response = await api.post("/api/token/refresh/", { refresh });
  return response.data;
};

// -------- ROOMS ----------
export const getRooms = async () => {
  const response = await api.get("/api/rooms/");
  return response.data;
};

// -------- RESERVATIONS ----------
export const getReservations = async () => {
  const response = await api.get("/api/reservations/");
  return response.data;
};
