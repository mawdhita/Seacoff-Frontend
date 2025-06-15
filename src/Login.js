import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const BASE_URL = 'https://seacoff-backend.vercel.app';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // ganti dari "email"
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  if (!username || !password) {
    alert("Mohon masukkan username dan password.");
    return;
  }

  try {
    const res = await axios.post("https://seacoff-backend.vercel.app/api/auth/login", {
      username,
      password,
    });

    // ✅ Simpan token sederhana di localStorage
    localStorage.setItem("authToken", "loginSuccess");

    alert("Login berhasil!");
    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.message || "Login gagal");
  }
};

  return (
    <div className="login-page">
      <div className="glass-container">
        <div className="login-icon">➡️</div>

        <h2>Selamat datang di admin Seacoff</h2>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Masuk
        </button>
      </div>
    </div>
  );
};

export default Login;
