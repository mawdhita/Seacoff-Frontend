import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiMenu, FiSearch, FiUser } from 'react-icons/fi';
import axios from 'axios';
import './App.css';

const BASE_URL = 'https://seacoff-backend.vercel.app';

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [coffees, setCoffees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/menus`);
      const menuData = response.data;

      setCoffees(menuData);
      const uniqueCategories = ['All', ...new Set(menuData.map(item => item.kategori))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Gagal ambil data menu:', error);
      alert('Gagal mengambil data menu. Silakan coba lagi nanti.');
    }
  };

  const filteredCoffees = coffees.filter(coffee => {
    const matchCategory = selectedCategory === 'All' || coffee.kategori === selectedCategory;
    const matchSearch = coffee.nama_menu.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        {/* Top Bar */}
        <div className="header-top">
          <div
            className="profile-icon"
            onClick={() => alert('Ini profil kamu bro!')}
          >
            <FiUser size={28} color="#5d3c14" />
          </div>
          <FiMenu
            className="menu-icon"
            onClick={() => navigate('/menu')}
            style={{ cursor: 'pointer', fontSize: '28px', color: '#5d3c14', marginRight: '10px' }}
          />
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <p>Selamat Datang,</p>
          <h1>Ngopi Dulu 🍵</h1>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari kopi kesukaanmu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => alert(`Searching for: ${searchTerm}`)}
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="category-list">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Coffee Cards */}
      <div className="coffee-section">
        <h2>Popular Coffee</h2>
        <div className="coffee-list">
          {filteredCoffees.length > 0 ? (
            filteredCoffees.map((coffee, idx) => (
              <div key={idx} className="coffee-card">
                <img
                  src={coffee.foto_menu ? coffee.foto_menu : `${BASE_URL}/uploads`}
                  alt={coffee.nama_menu}
                />
                <h3>{coffee.nama_menu}</h3>
                <p>Rp {coffee.harga}</p>
                <button
                  className="order-button"
                  onClick={() => navigate(`/detail/${coffee.id_menu}`)}
                >
                  + Pesan
                </button>
              </div>
            ))
          ) : (
            <p>Tidak ada menu yang sesuai.</p>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bottom-nav">
        <FiHome className="nav-icon" onClick={() => navigate('/')} />
        <FiShoppingCart className="nav-icon" onClick={() => navigate('/cart')} />
        <FiMenu className="nav-icon" onClick={() => navigate('/menu')} />
      </div>
    </div>
  );
};

export default Home;
