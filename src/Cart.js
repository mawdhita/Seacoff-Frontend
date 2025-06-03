import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = 'https://seacoff-production.up.railway.app';  // <-- BASE_URL yang lo pake

  const fetchCart = () => {
    axios.get(`${BASE_URL}/api/cart`)
      .then(res => {
        setCartItems(res.data);
        calculateTotal(res.data);
      })
      .catch(err => console.error('Gagal ambil cart:', err));
  };

  useEffect(() => {
    axios.defaults.headers.common['x-session-id'] = localStorage.getItem('session_id');
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    setTotalPrice(total);
  };

  const handleIncrease = (id_cart, currentQty) => {
    const newQty = currentQty + 1;
    axios.put(`${BASE_URL}/api/cart/${id_cart}`, { quantity: newQty })  // <- ganti localhost jadi BASE_URL
      .then(() => fetchCart())
      .catch(err => console.error('Gagal update quantity:', err));
  };

  const handleDecrease = (id_cart, currentQty) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    axios.put(`${BASE_URL}/api/cart/${id_cart}`, { quantity: newQty })  // <- ganti localhost jadi BASE_URL
      .then(() => fetchCart())
      .catch(err => console.error('Gagal update quantity:', err));
  };

  const handleRemove = (id_cart) => {
    axios.delete(`${BASE_URL}/api/cart/${id_cart}`)  // <- ganti localhost jadi BASE_URL
      .then(() => fetchCart())
      .catch(err => console.error('Gagal hapus item:', err));
  };

  const handleCheckout = () => {
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    localStorage.setItem('checkoutTotalPrice', totalPrice);
    navigate('/checkout', {
      state: {
        items: cartItems,
        totalPrice: totalPrice,
      }
    });
  };

  if (cartItems.length === 0) return <div>Keranjang kamu kosong!</div>;

  return (
    <div className="cart-container">
      <button className="back-icon" onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
        ←
      </button>

      <h2>Keranjang Belanja</h2>
      <ul className="cart-items">
        {cartItems.map(item => (
          <li key={item.id_cart} className="cart-item">
            <img
              src={`${BASE_URL}/uploads/${item.foto_menu}`}  // <- ganti localhost jadi BASE_URL
              alt={item.nama_menu}
              className="cart-item-img"
            />
            <div className="cart-item-info">
              <h3>{item.nama_menu}</h3>
              <div className="quantity-control">
                <button onClick={() => handleDecrease(item.id_cart, item.quantity)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.id_cart, item.quantity)}>+</button>
              </div>
              <p>Harga: Rp {item.harga.toLocaleString()}</p>
              <p>Total: Rp {(item.quantity * item.harga).toLocaleString()}</p>
              <button className="remove-button" onClick={() => handleRemove(item.id_cart)}>Hapus</button>
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
