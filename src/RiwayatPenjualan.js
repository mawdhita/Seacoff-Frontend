import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RiwayatPenjualan = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://seacoff-backend.vercel.app/api/orders')
      .then(res => {
        const rawData = res.data;

        // Group data berdasarkan id_order
        const groupedData = rawData.reduce((acc, item) => {
          if (!acc[item.id_order]) {
            acc[item.id_order] = {
              id_order: item.id_order,
              nama_user: item.nama_user,
              total_pesanan: item.total_pesanan,
              produk: []
            };
          }
          acc[item.id_order].produk.push(`${item.nama_produk} x ${item.jumlah}`);
          return acc;
        }, {});

        // Ubah object ke array
        setData(Object.values(groupedData));
      })
      .catch(err => console.error(err));
  }, []);

  const totalOrders = data.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'linear-gradient(to bottom, #4e54c8, #8f94fb)', color: '#fff', padding: '20px' }}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '30px' }}>F.</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              📊 <span style={{ marginLeft: '10px' }}>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/menu" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              🍽️ <span style={{ marginLeft: '10px' }}>Menu</span>
            </Link>
          </li>
          <li style={{ marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '8px' }}>
            <Link to="/riwayat-penjualan" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              📜 <span style={{ marginLeft: '10px' }}>Riwayat</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Restaurant Orders</h1>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ flex: '1 1 200px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h2 style={{ margin: 0 }}>{totalOrders}</h2>
            <p style={{ margin: 0, color: '#555' }}>Total Orders</p>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f0f0f0' }}>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID Order</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama User</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Produk</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.id_order}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.nama_user}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Rp {parseFloat(item.total_pesanan).toLocaleString()}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.produk.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatPenjualan;
