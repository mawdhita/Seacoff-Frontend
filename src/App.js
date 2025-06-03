import React from 'react';
import axios from 'axios';  // <== Tambahkan ini
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Home from './Home';
import DetailMenu from './DetailMenu';
import './App.css';
import Cart from './Cart';
import Menu from './Menu';
import Checkout from './Checkout'; // ✅ Tambah ini
import Nota from './Nota';         // ✅ Tambah ini

axios.defaults.headers.common['x-session-id'] = localStorage.getItem('session_id');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/detail/:id" element={<DetailMenu />} />
        <Route path="/checkout" element={<Checkout />} /> {/* ✅ Route checkout */}
        <Route path="/nota" element={<Nota />} />         {/* ✅ Route nota */}
      </Routes>
    </Router>
  );
}

if (!localStorage.getItem('session_id')) {
  localStorage.setItem('session_id', `sess-${Math.random().toString(36).substring(2, 15)}`);
}

export default App;
