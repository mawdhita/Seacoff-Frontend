import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Home from './Home';
import DetailMenu from './DetailMenu';
import './App.css';
import Cart from './Cart';
import Menu from './Menu';
import Checkout from './Checkout';
import Nota from './Nota';
import Login from "./Login";
import Dashboard from "./Dashboard";
import MenuPage from "./MenuPage";
import RiwayatPenjualan from "./RiwayatPenjualan";
import backgroundImage from './asset/mike-kenneally-zlwDJoKTuA8-unsplash.jpg';

// Initialize session ID if not exists
if (!localStorage.getItem('session_id')) {
  localStorage.setItem('session_id', `sess-${Math.random().toString(36).substring(2, 15)}`);
}

// Set default axios header
axios.defaults.headers.common['x-session-id'] = localStorage.getItem('session_id');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div 
        className="App" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh'
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/detail/:id" element={<DetailMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/nota" element={<Nota />} />
          
          {/* Auth Route */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/menu-page" 
            element={isAuthenticated ? <MenuPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/riwayat-penjualan" 
            element={isAuthenticated ? <RiwayatPenjualan /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;