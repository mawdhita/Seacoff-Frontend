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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // ✅ Registrasi plugin Filler agar `fill: true` berfungsi
);

const Dashboard = () => {
  const [penjualanMingguan, setPenjualanMingguan] = useState(0);
  const [jumlahMenuMingguan, setJumlahMenuMingguan] = useState(0);
  const [penjualanHarian, setPenjualanHarian] = useState([]);
  const [bestSeller, setBestSeller] = useState({ makanan: null, minuman: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      axios.get('https://seacoff-backend.vercel.app/api/sales/sales-per-week'),
      axios.get('https://seacoff-backend.vercel.app/api/sales/sales-per-day'),
      axios.get('https://seacoff-backend.vercel.app/api/sales/best-sellers'),
    ])
      .then(([weekRes, dayRes, bestRes]) => {
        const w = weekRes.data;
        setPenjualanMingguan(w.total_income ?? 0);
        setJumlahMenuMingguan(w.total_items ?? 0);

        setPenjualanHarian(Array.isArray(dayRes.data) ? dayRes.data : []);
        
        if (Array.isArray(bestRes.data)) {
          const makanan = bestRes.data.find(i => i.kategori.toLowerCase() === 'makanan') || null;
          const minuman = bestRes.data.find(i => i.kategori.toLowerCase() === 'minuman') || null;
          setBestSeller({ makanan, minuman });
        } else {
          setBestSeller({ makanan: null, minuman: null });
        }
      })
      .catch(err => {
        console.error('🔥 Error fetching dashboard data:', err.message);
        setError('Gagal memuat data dari server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatRupiah = number =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  // Siapkan data chart
  const chartData = {
    labels: penjualanHarian.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
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
          {/* ...navigasi sama seperti sebelumnya */}
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

        {loading && <p>Memuat data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
