import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Nota = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { menu, quantity, total, customerName } = location.state || {};

  const currentDate = new Date();
  const tanggal = currentDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const waktu = currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="nota-wrapper">
      <div className="nota-card">
        <div className="nota-icon">✔️</div>
        <h2 className="nota-title">Success</h2>
        <p className="nota-subtitle">Pesanan kamu berhasil dibuat</p>

        <div className="nota-amount-box">
          <div className="nota-amount">Rp {total.toLocaleString()}</div>
          <div className="nota-amount-label">Total Bayar</div>
        </div>

        <div className="nota-info"><strong>Nama:</strong> {customerName}</div>
        <div className="nota-info"><strong>Menu:</strong> {menu?.nama_menu} x {quantity}</div>
        <div className="nota-info"><strong>Tanggal:</strong> {tanggal}</div>
        <div className="nota-info"><strong>Waktu:</strong> {waktu}</div>

        <button className="nota-done-button" onClick={() => navigate('/')}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Nota;
