import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const BASE_URL = 'https://seacoff-backend.vercel.app/api'; 
const RAW_URL = 'https://seacoff-backend.vercel.app/uploads'; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cart`);
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error('Gagal ambil cart:', error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    setTotalPrice(total);
  };

  const handleIncrease = async (id_cart, currentQty) => {
    const newQty = currentQty + 1;
    try {
      await axios.put(`${BASE_URL}/cart/${id_cart}`, { quantity: newQty });
      fetchCart();
    } catch (error) {
      console.error('Gagal update quantity:', error);
    }
  };

  const handleDecrease = async (id_cart, currentQty) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    try {
      await axios.put(`${BASE_URL}/cart/${id_cart}`, { quantity: newQty });
      fetchCart();
    } catch (error) {
      console.error('Gagal update quantity:', error);
    }
  };

  const handleRemove = async (id_cart) => {
    try {
      await axios.delete(`${BASE_URL}/cart/${id_cart}`);
      fetchCart();
    } catch (error) {
      console.error('Gagal hapus item:', error);
    }
  };

  const handleCheckout = () => {
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    localStorage.setItem('checkoutTotalPrice', totalPrice);
    navigate('/checkout', {
      state: { items: cartItems, totalPrice }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <button
          className="back-icon"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          ←
        </button>
        <h2>Keranjang Belanja</h2>
        <div>Keranjang kamu kosong!</div>
      </div>
    );
  }

  const getImageUrl = (foto_menu) => {
    if (!foto_menu || foto_menu.trim() === '') {
      return 'https://via.placeholder.com/150?text=No+Image';
    }
    return `${RAW_URL}/${foto_menu}`;
  };

  return (
    <div className="cart-container">
      <button
        className="back-icon"
        onClick={() => navigate(-1)}
        aria-label="Kembali"
      >
        ←
      </button>

      <h2>Keranjang Belanja</h2>

      <ul className="cart-items">
        {cartItems.map(item => (
          <li key={item.id_cart} className="cart-item">
            <img
              src={getImageUrl(item.foto_menu)}
              alt={item.nama_menu}
              className="cart-item-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
            />
            <div className="cart-item-info">
              <h3>{item.nama_menu}</h3>
              <div className="quantity-control">
                <button
                  onClick={() => handleDecrease(item.id_cart, item.quantity)}
                  aria-label={`Kurangi jumlah ${item.nama_menu}`}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item.id_cart, item.quantity)}
                  aria-label={`Tambah jumlah ${item.nama_menu}`}
                >
                  +
                </button>
              </div>
              <p>Harga: Rp {item.harga.toLocaleString()}</p>
              <p>Total: Rp {(item.quantity * item.harga).toLocaleString()}</p>
              <button
                className="remove-button"
                onClick={() => handleRemove(item.id_cart)}
                aria-label={`Hapus ${item.nama_menu} dari keranjang`}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <h3>Total Harga: Rp {totalPrice.toLocaleString()}</h3>
      </div>

      <button className="checkout-button" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default Cart;
