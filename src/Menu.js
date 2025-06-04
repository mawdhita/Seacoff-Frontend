import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const BASE_URL = 'https://seacoff-backend.vercel.app';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/menus`)
      .then((res) => {
        setMenus(res.data);
        console.log('Data menus:', res.data);
      })
      .catch((err) => console.error('Gagal fetch menu:', err));
  }, []);

  const categories = ['All', 'Minuman', 'Makanan'];

  // Filter menu berdasarkan kategori dan pencarian nama
  const filteredMenus = menus.filter(menu => {
    const kategori = menu.kategori || '';
    const nama = menu.nama_menu || '';

    const matchKategori = selectedCategory === 'All' || kategori.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = nama.toLowerCase().includes(searchTerm.toLowerCase());

    return matchKategori && matchSearch;
  });

  // Fungsi dapatkan gambar: pakai URL penuh dari database, jika kosong pakai placeholder
  const getImage = (fotoMenuUrl) => {
    if (!fotoMenuUrl || fotoMenuUrl.trim() === '') {
      // placeholder image bebas pakai URL online
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    return fotoMenuUrl;
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2>Menu</h2>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Cari menu..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Button search hanya sebagai icon, pencarian realtime di input */}
          <button className="search-button" aria-label="search">
            🔍
          </button>
        </div>
      </div>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-list">
        {filteredMenus.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Tidak ada menu yang ditemukan.</p>
        ) : (
          filteredMenus.map(menu => (
            <div className="menu-card" key={menu.id_menu}>
              <img
                src={getImage(menu.foto_menu)}
                alt={menu.nama_menu}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h3>{menu.nama_menu}</h3>
              <p>Rp {menu.harga ? menu.harga.toLocaleString() : '-'}</p>
              <button
                className="order-button"
                onClick={() => navigate(`/DetailMenu`)}
              >
                + Pesan
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
