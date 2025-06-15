import React, { useEffect, useState, useCallback } from 'react';
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
  Legend 
} from 'chart.js';
import axios from 'axios';
import { BarChart3, Coffee, History, User, TrendingUp, Package, RefreshCw } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    penjualanMingguan: 0,
    jumlahMenuMingguan: 0,
    penjualanHarian: [],
    bestSeller: { makanan: null, minuman: null }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatRupiah = useCallback((number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }, []);

  const formatDate = useCallback((dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [weeklyResponse, dailyResponse, bestSellerResponse] = await Promise.all([
        axios.get('https://seacoff-backend.vercel.app/api/sales-per-week'),
        axios.get('https://seacoff-backend.vercel.app/api/sales-per-day'),
        axios.get('https://seacoff-backend.vercel.app/api/best-sellers')
      ]);

      // Hitung total penjualan dan orders dari data mingguan (ambil minggu terakhir)
      const weeklyData = weeklyResponse.data || [];
      const currentWeekData = weeklyData[weeklyData.length - 1] || {};
      const totalSales = currentWeekData.total_sales || 0;
      const totalOrders = currentWeekData.total_orders || 0;

      // Ambil top best sellers
      const bestSellers = bestSellerResponse.data || [];
      const topProduct = bestSellers[0] || null;
      const secondProduct = bestSellers[1] || null;

      setDashboardData({
        penjualanMingguan: totalSales,
        jumlahMenuMingguan: totalOrders,
        penjualanHarian: dailyResponse.data || [],
        bestSeller: { 
          makanan: topProduct, 
          minuman: secondProduct 
        }
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh setiap 5 menit
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const chartData = {
    labels: dashboardData.penjualanHarian.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Penjualan Harian',
        data: dashboardData.penjualanHarian.map(item => item.total_sales || 0),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Penjualan: ${formatRupiah(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return formatRupiah(value);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6B7280'
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(99, 102, 241)',
        hoverBorderColor: '#fff'
      }
    }
  };

  const sidebarItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard', active: true },
    { to: '/menu', icon: Coffee, label: 'Menu', active: false },
    { to: '/riwayat-penjualan', icon: History, label: 'Riwayat', active: false }
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'bg-white', trend = null }) => (
    <div className={`${color} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 font-medium">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );

  const BestSellerItem = ({ item, icon, category, rank }) => (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{item?.nama_produk || `Tidak ada data ${category}`}</p>
          <p className="text-sm text-gray-500">{category}</p>
        </div>
      </div>
      {item && (
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
            {item.total_terjual}x terjual
          </span>
        </div>
      )}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mx-auto mb-4"></div>
          <Coffee className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
        <p className="text-sm text-gray-400 mt-1">Harap tunggu sebentar</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </button>
      </div>
    </div>
  );

  if (loading && !dashboardData.penjualanHarian.length) {
    return <LoadingSpinner />;
  }

  if (error && !dashboardData.penjualanHarian.length) {
    return <ErrorState />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Coffee className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <span className="text-xl font-bold">SeaCoff</span>
              <p className="text-indigo-200 text-sm">Dashboard Admin</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg transform scale-105' 
                    : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Halo Admin!</h1>
              <p className="text-gray-600">Selamat datang kembali di dashboard SeaCoff</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <button 
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <p className="text-sm text-gray-500">Terakhir diperbarui</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Penjualan Minggu Ini"
            value={formatRupiah(dashboardData.penjualanMingguan)}
            icon={TrendingUp}
            trend="↗ Minggu ini"
          />
          <StatCard
            title="Total Pesanan"
            value={`${dashboardData.jumlahMenuMingguan} pesanan`}
            icon={Package}
            trend="↗ Minggu ini"
          />
          <StatCard
            title="Produk Terlaris"
            value={dashboardData.bestSeller.makanan?.nama_produk || 'Belum ada data'}
            icon={Coffee}
            trend={dashboardData.bestSeller.makanan ? `${dashboardData.bestSeller.makanan.total_terjual}x terjual` : ''}
          />
        </div>

        {/* Charts and Best Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Grafik Penjualan</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {dashboardData.penjualanHarian.length} hari terakhir
              </span>
            </div>
            <div style={{ height: '350px' }}>
              {dashboardData.penjualanHarian.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Tidak ada data penjualan</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Produk Terlaris</h3>
              <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
                Top 2
              </span>
            </div>
            <div className="space-y-4">
              {dashboardData.bestSeller.makanan || dashboardData.bestSeller.minuman ? (
                <>
                  {dashboardData.bestSeller.makanan && (
                    <BestSellerItem 
                      item={dashboardData.bestSeller.makanan}
                      icon="🥇"
                      category="Produk Terlaris #1"
                      rank={1}
                    />
                  )}
                  
                  {dashboardData.bestSeller.minuman && (
                    <BestSellerItem 
                      item={dashboardData.bestSeller.minuman}
                      icon="🥈"
                      category="Produk Terlaris #2"
                      rank={2}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">Belum ada data penjualan</p>
                  <p className="text-sm text-gray-400 mt-1">Data akan muncul setelah ada transaksi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>© 2025 SeaCoff Dashboard - Sistem Manajemen Restoran</span>
            <span>Data diperbarui otomatis setiap 5 menit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;