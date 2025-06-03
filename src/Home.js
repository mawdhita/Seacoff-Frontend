import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiMenu, FiSearch, FiUser } from 'react-icons/fi';
import axios from 'axios';
import './App.css';

const BASE_URL = 'https://seacoff-production.up.railway.app';

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
      const response = await axios.get(`${BASE_URL}/api/menu`);
      const menuData = response.data;

      setCoffees(menuData);
      const uniqueCategories = ['All', ...new Set(menuData.map(item => item.kategori))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Gagal ambil data menu:', error);
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
      <div className="home-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        
        {/* Baris Atas: Icon Profile + Menu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          {/* Icon User/Profile */}
          <div
            style={{
              marginLeft: '10px',
              padding: '8px',
              borderRadius: '50%',
              border: '2px solid #5d3c14',
              boxShadow: '0 0 6px rgba(93, 60, 20, 0.6)',
              cursor: 'pointer',
            }}
            onClick={() => alert('Ini profil kamu bro!')}
          >
            <FiUser size={28} color="#5d3c14" />
          </div>

          {/* Icon Menu */}
          <FiMenu
            className="user-icon"
            onClick={() => navigate('/menu')}
            style={{ cursor: 'pointer', fontSize: '28px', color: '#5d3c14', marginRight: '10px' }}
          />
        </div>

        {/* Welcome Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#5d3c14' }}>Selamat Datang,</p>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#3a2f10' }}>Ngopi Dulu 🍵</h1>
        </div>

        {/* Search Bar */}
        <div
          className="search-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '10px',
          }}
        >
          <input
            type="text"
            placeholder="Cari kopi kesukaanmu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '25px',
              border: '1.5px solid #5d3c14',
              outline: 'none',
              width: '200px',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={() => alert(`Searching for: ${searchTerm}`)}
            style={{
              backgroundColor: '#5d3c14',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 8px #5d3c14',
              color: 'white',
            }}
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
                  src={`${BASE_URL}/uploads/${coffee.foto_menu}`}
                  alt={coffee.nama_menu}
                />
                <h3>{coffee.nama_menu}</h3>
                <p>Rp {coffee.harga}</p>
                <button className="order-button" onClick={() => navigate(`/detail/${coffee.id_menu}`)}>
                  + Pesan
                </button>
              </div>
            ))
          ) : (
            <p>Tidak ada menu yang sesuai.</p>
          )}
        </div>
      </div>

      {/* Bottom Navbar (Footer) */}
      <div className="bottom-nav">
        <FiHome className="nav-icon" onClick={() => navigate('/')} />
        <FiShoppingCart className="nav-icon" onClick={() => navigate('/cart')} />
        <FiMenu className="nav-icon" onClick={() => navigate('/menu')} />
      </div>
    </div>
  );
};

export default Home;
