// =====================================================
// RegisterPage.js — Fixed for Vercel & Correct API Calls
// =====================================================

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import api, { loginUser } from "../api";  // ✅ FIXED IMPORT

import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../AuthContext";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../styles/register.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.warning("Please fill all required fields", { theme: "dark" });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      // ✅ Create user account
      await api.post("/api/users/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      // 🔐 Auto-login after registration
      const tokenData = await loginUser(form.username, form.password);
      login(tokenData);

      toast.success("✅ Registration successful!", { theme: "dark" });
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.error ||
          "❌ Registration failed. Try another username.",
        { theme: "dark" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="ai-bg">
        <div className="matrix-layer"></div>
        <div className="glow-layer"></div>
      </div>

      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="input-group">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="redirect-text">
          Already registered?{" "}
          <Link to="/login" className="redirect-link">
            Go to Login
          </Link>
        </p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        pauseOnHover={false}
        draggable={false}
        closeOnClick
        theme="dark"
      />
    </div>
  );
}
