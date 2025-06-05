import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiArrowLeft } from 'react-icons/hi';
import './App.css';

const BASE_URL = 'https://seacoff-backend.vercel.app'; // Base URL untuk API
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/mawdhita/Seacoff-Backend/main/uploads'; // URL gambar

const DetailMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Session ID
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `sess-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('session_id', sessionId);
    }

    axios.defaults.headers.common['x-session-id'] = sessionId;
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/DetailMenu/${id}`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error('Gagal fetch detail menu:', err));
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    axios
      .post(`${BASE_URL}/api/cart`, {
        id_menu: menu.id_menu,
        quantity,
      })
      .then((res) => {
        console.log('Berhasil tambah ke keranjang:', res.data);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      })
      .catch((err) => {
        console.error(
          'Gagal tambah ke keranjang:',
          err.response ? err.response.data : err.message
        );
      });
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { menu, quantity } });
  };

  if (!menu) return <div>Loading...</div>;

  // 🔥 Gunakan raw.githubusercontent untuk gambar
  const getImage = (fotoMenu) => {
    if (!fotoMenu || fotoMenu.trim() === '') {
      return 'https://via.placeholder.com/300x300.png?text=No+Image'; // Placeholder default
    }
    return `${RAW_GITHUB_URL}/${fotoMenu}`;
  };

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <HiArrowLeft size={24} />
      </button>

      <div className="detail-image-wrapper">
        <img
          src={getImage(menu.foto_menu)}
          alt={menu.nama_menu}
          className="detail-image"
        />
      </div>

      <div className="detail-info">
        <h2 className="detail-title">{menu.nama_menu}</h2>
        <p className="detail-category">{menu.kategori}</p>
        <p className="detail-price">Rp {menu.harga.toLocaleString()}</p>

        <p className="detail-description">{menu.deskripsi}</p>

        <div className="detail-action">
          <div className="quantity-control">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Tambah ke Keranjang
          </button>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <img
              src="/assets/success-icon.png"
              alt="Success"
              className="modal-icon"
            />
            <h2>Congratulations!</h2>
            <p>Sip, berhasil ditambahkan ke keranjangmu!</p>
            <div className="loader"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailMenu;
