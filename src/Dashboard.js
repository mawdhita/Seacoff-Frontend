import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  Coffee, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Menu,
  Home,
  History,
  Star,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [penjualanMingguan, setPenjualanMingguan] = useState(0);
  const [jumlahMenuMingguan, setJumlahMenuMingguan] = useState(0);
  const [penjualanHarian, setPenjualanHarian] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data untuk demo - nanti akan diganti dengan API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulasi API call - ganti dengan axios calls ke backend Express.js
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setPenjualanMingguan(15750000);
        setJumlahMenuMingguan(324);
        setPenjualanHarian([
          { date: '2024-06-10', total_sales: 2500000 },
          { date: '2024-06-11', total_sales: 3200000 },
          { date: '2024-06-12', total_sales: 2800000 },
          { date: '2024-06-13', total_sales: 4100000 },
          { date: '2024-06-14', total_sales: 3600000 },
          { date: '2024-06-15', total_sales: 2900000 },
          { date: '2024-06-16', total_sales: 3800000 }
        ]);
        setBestSeller([
          { nama_produk: 'Espresso Premium', total_terjual: 89 },
          { nama_produk: 'Cappuccino Classic', total_terjual: 76 },
          { nama_produk: 'Latte Vanilla', total_terjual: 65 },
          { nama_produk: 'Americano', total_terjual: 54 },
          { nama_produk: 'Mocha Delight', total_terjual: 43 }
        ]);

   
        const weeklyResponse = await axios.get('https://seacoff-backend.vercel.app/api/dashboardsales-per-week');
        const dailyResponse = await axios.get('https://seacoff-backend.vercel.app/api/dashboard/sales-per-day');
        const bestSellerResponse = await axios.get('https://seacoff-backend.vercel.app/api/dashboard/best-sellers');
   

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

  const chartData = penjualanHarian.map(item => ({
    date: new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
    sales: item.total_sales || 0
  }));

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const MenuItem = ({ icon: Icon, label, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEACOFF
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <MenuItem icon={Home} label="Dashboard" active={true} />
          <MenuItem icon={Menu} label="Menu" />
          <MenuItem icon={History} label="Riwayat" />
          <MenuItem icon={Users} label="Pelanggan" />
          <MenuItem icon={BarChart3} label="Laporan" />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Selamat datang kembali, Admin!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Penjualan Mingguan"
              value={formatRupiah(penjualanMingguan)}
              icon={DollarSign}
              color="bg-gradient-to-r from-green-500 to-emerald-600"
              subtitle="↑ 12% dari minggu lalu"
            />
            <StatCard
              title="Total Pesanan"
              value={`${jumlahMenuMingguan} pesanan`}
              icon={ShoppingCart}
              color="bg-gradient-to-r from-blue-500 to-cyan-600"
              subtitle="↑ 8% dari minggu lalu"
            />
            <StatCard
              title="Rata-rata Harian"
              value={formatRupiah(Math.round(penjualanMingguan / 7))}
              icon={TrendingUp}
              color="bg-gradient-to-r from-purple-500 to-pink-600"
              subtitle="Konsisten stabil"
            />
            <StatCard
              title="Menu Aktif"
              value="24 menu"
              icon={Coffee}
              color="bg-gradient-to-r from-orange-500 to-red-600"
              subtitle="3 menu baru"
            />
          </div>

          {/* Charts and Best Sellers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Penjualan 7 Hari Terakhir</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <span>Penjualan Harian</span>
                </div>
              </div>
              
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatRupiah(value), 'Penjualan']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#8b5cf6' }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Tidak ada data penjualan</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Best Sellers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Menu Terlaris</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="space-y-4">
                {bestSeller.length > 0 ? (
                  bestSeller.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.nama_produk}</p>
                          <p className="text-xs text-gray-500">Menu favorit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{item.total_terjual}x</p>
                        <p className="text-xs text-gray-500">terjual</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Coffee className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Tidak ada data menu terlaris</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;