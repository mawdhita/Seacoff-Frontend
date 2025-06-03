import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const BASE_URL = 'https://seacoff-production.up.railway.app';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let { items, totalPrice } = location.state || {};

  if ((!items || items.length === 0) && localStorage.getItem('checkoutItems')) {
    try {
      items = JSON.parse(localStorage.getItem('checkoutItems'));
      totalPrice = Number(localStorage.getItem('checkoutTotalPrice')) || 0;
    } catch {
      items = [];
      totalPrice = 0;
    }
  }

  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (!items || items.length === 0) {
      alert("Keranjang kosong, silakan pilih item dulu.");
      navigate('/cart');
    }
  }, [items, navigate]);

  if (!items || items.length === 0) {
    return null;
  }

  const subtotal = totalPrice;
  const ppn = subtotal * 0.1;
  const service = subtotal * 0.05;
  const total = subtotal + ppn + service;

  const handleSelesai = async () => {
    if (!customerName.trim()) {
      alert("Nama pemesan wajib diisi!");
      return;
    }

    const data = {
      id_user: 1,
      total_pesanan: total,
      status: "pending",
      nama_user: customerName,
      produk: items.map(item => ({
        nama_produk: item.nama_menu,
        jumlah: item.quantity,
        harga: item.harga
      }))
    };

    console.log("📦 Data dikirim ke backend:", data);

    try {
      const res = await axios.post(`${BASE_URL}/api/orders`, data);
      console.log("✅ Respon dari backend:", res.data);

      navigate('/nota', {
        state: {
          items,
          total,
          customerName,
          breakdown: {
            subtotal,
            ppn,
            service,
          }
        }
      });
    } catch (err) {
      console.error("❌ Gagal checkout:", err);
      alert("Gagal melakukan checkout.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <h2 className="checkout-header">My Order</h2>

      <div className="checkout-card">
        {items.map((item, index) => (
          <div className="checkout-item" key={index}>
            <img
              src={`${BASE_URL}/uploads/${item.foto_menu}`}
              alt={item.nama_menu}
              className="item-img-side"
            />
            <div className="item-info">
              <div className="item-title">{item.nama_menu}</div>
              <div className="item-sub">{item.kategori}</div>
              <div className="item-price">Rp {item.harga.toLocaleString()}</div>
              <div className="item-qty">x {item.quantity}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-input">
        <label htmlFor="name">Nama Pemesan</label>
        <input
          type="text"
          id="name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Masukkan nama kamu"
        />
      </div>

      <div className="checkout-summary-box">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>PPN (10%)</span>
          <span>Rp {ppn.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Service (5%)</span>
          <span>Rp {service.toLocaleString()}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </div>

      <button className="checkout-button-full" onClick={handleSelesai}>
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
