import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [penjualanMingguan, setPenjualanMingguan] = useState(0);
  const [jumlahMenuMingguan, setJumlahMenuMingguan] = useState(0);
  const [penjualanHarian, setPenjualanHarian] = useState([]);
  const [bestSeller, setBestSeller] = useState({ makanan: null, minuman: null });

  const makananKeywords = ['croffle', 'rice', 'toast', 'nasi', 'roti', 'mie', 'ayam', 'kue'];
  const minumanKeywords = ['iced', 'kopi', 'espresso', 'americano', 'tea', 'lemonade', 'latte', 'milk', 'mocktail'];

  const isMakanan = (nama) => makananKeywords.some(keyword => nama.toLowerCase().includes(keyword));
  const isMinuman = (nama) => minumanKeywords.some(keyword => nama.toLowerCase().includes(keyword));

  useEffect(() => {
    axios.get('https://seacoff-backend.vercel.app/api/sales-per-week')
      .then(res => {
        const weeklyData = res.data;
        const totalIncome = weeklyData.reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
        const totalItems = weeklyData.reduce((sum, item) => sum + item.total_orders, 0);
        setPenjualanMingguan(totalIncome);
        setJumlahMenuMingguan(totalItems);
      })
      .catch(err => console.error('Gagal mengambil data penjualan mingguan:', err));

    axios.get('https://seacoff-backend.vercel.app/api/sales-per-day')
      .then(res => setPenjualanHarian(res.data))
      .catch(err => console.error('Gagal mengambil data penjualan harian:', err));

    axios.get('https://seacoff-backend.vercel.app/api/best-sellers')
      .then(res => {
        const data = res.data;
        const makanan = data.find(item => isMakanan(item.nama_produk));
        const minuman = data.find(item => isMinuman(item.nama_produk));
        setBestSeller({ makanan, minuman });
      })
      .catch(err => console.error('Gagal mengambil data best seller:', err));
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const chartData = {
    labels: penjualanHarian.map(item => {
      const dateObj = new Date(item.date);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    }),
    datasets: [
      {
        label: 'Penjualan Harian',
        data: penjualanHarian.map(item => item.total_sales),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Grafik Penjualan Minggu Ini',
      },
    },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      <div style={{ width: '240px', background: 'linear-gradient(to bottom, #4e54c8, #8f94fb)', color: '#fff', padding: '20px' }}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '30px' }}>F.</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '8px' }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              📊 <span style={{ marginLeft: '10px' }}>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/menu-page" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              🍽️ <span style={{ marginLeft: '10px' }}>Menu</span>
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/riwayat-penjualan" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              📜 <span style={{ marginLeft: '10px' }}>Riwayat</span>
            </Link>
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://img.icons8.com/ios/50/000000/user--v1.png" alt="User" style={{ width: '40px', marginRight: '10px' }} />
            <h2>Halo Admin!</h2>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3>Statistik Penjualan (Minggu Ini)</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatRupiah(penjualanMingguan)}</p>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3>Jumlah Menu Terjual (Minggu Ini)</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{jumlahMenuMingguan}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 2, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>Grafik Penjualan Per Minggu</h3>
            <div style={{ height: '300px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>Menu Terlaris</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bestSeller.makanan ? (
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>🍽️ {bestSeller.makanan.nama_produk}</span>
                  <span>{bestSeller.makanan.total_terjual}x</span>
                </li>
              ) : (
                <li>Tidak ada data makanan</li>
              )}
              {bestSeller.minuman ? (
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>🥤 {bestSeller.minuman.nama_produk}</span>
                  <span>{bestSeller.minuman.total_terjual}x</span>
                </li>
              ) : (
                <li>Tidak ada data minuman</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
