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
  Filler  // Add Filler plugin for fill option
} from 'chart.js';
import axios from 'axios';
import './App.css';

// Register Chart.js components including Filler
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler  // Register Filler plugin
);

const Dashboard = () => {
  const [penjualanMingguan, setPenjualanMingguan] = useState(0);
  const [jumlahMenuMingguan, setJumlahMenuMingguan] = useState(0);
  const [penjualanHarian, setPenjualanHarian] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'https://seacoff-backend.vercel.app';  // <-- BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch weekly sales data
        const weeklyResponse = await axios.get('https://seacoff-backend.vercel.app/api/sales/sales-per-week');
        if (weeklyResponse.data && weeklyResponse.data.length > 0) {
          // Calculate total sales and orders from weekly data
          const totalWeeklySales = weeklyResponse.data.reduce((sum, week) => sum + (week.total_sales || 0), 0);
          const totalWeeklyOrders = weeklyResponse.data.reduce((sum, week) => sum + (week.total_orders || 0), 0);
          
          setPenjualanMingguan(totalWeeklySales);
          setJumlahMenuMingguan(totalWeeklyOrders);
        }

        // Fetch daily sales data
        const dailyResponse = await axios.get('https://seacoff-backend.vercel.app/api/sales/sales-per-day');
        if (dailyResponse.data) {
          setPenjualanHarian(dailyResponse.data);
        }

        // Fetch best sellers data
        const bestSellerResponse = await axios.get('https://seacoff-backend.vercel.app/api/sales/best-sellers');
        if (bestSellerResponse.data) {
          setBestSeller(bestSellerResponse.data);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRupiah = (number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
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
        data: penjualanHarian.map(item => item.total_sales || 0),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Grafik Penjualan Harian',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatRupiah(value);
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'linear-gradient(to bottom, #4e54c8, #8f94fb)', color: '#fff', padding: '20px' }}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '30px' }}>SEACOFF</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '8px' }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              📊 <span style={{ marginLeft: '10px' }}>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/menu" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://img.icons8.com/ios/50/000000/user--v1.png" alt="User" style={{ width: '40px', marginRight: '10px' }} />
            <h2>Halo Admin!</h2>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Penjualan Mingguan</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#4e54c8' }}>
                {formatRupiah(penjualanMingguan)}
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Total Pesanan</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#4e54c8' }}>
                {jumlahMenuMingguan} pesanan
              </p>
            </div>
          </div>
        </div>

        {/* Charts and Best Sellers */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Chart */}
          <div style={{ flex: 2, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>Grafik Penjualan Harian</h3>
            <div style={{ height: '300px' }}>
              {penjualanHarian.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <p>Tidak ada data penjualan harian</p>
                </div>
              )}
            </div>
          </div>

          {/* Best Sellers */}
          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>Menu Terlaris</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bestSeller.length > 0 ? (
                bestSeller.map((item, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontWeight: '500' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'} {item.nama_produk}
                    </span>
                    <span style={{ color: '#4e54c8', fontWeight: 'bold' }}>
                      {item.total_terjual}x
                    </span>
                  </li>
                ))
              ) : (
                <li style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  Tidak ada data menu terlaris
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;