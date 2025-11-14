// =====================================================
// LoginPage.js — Futuristic Tech Theme + Toast Messages
// =====================================================

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Please enter username and password", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("token/", { username, password });
      login(res.data);
      toast.success("✅ Login successful!", { theme: "dark" });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.detail ||
          "❌ Invalid credentials. Please try again.",
        { theme: "dark" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="ai-bg">
        <div className="matrix-layer"></div>
        <div className="glow-layer"></div>
      </div>

      <div className="login-card">
        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="redirect-text">
          Don’t have an account?{" "}
          <Link to="/register" className="redirect-link">
            Register here
          </Link>
        </p>
      </div>

      {/* Toast notifications */}
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
