import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RiwayatPenjualan = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://seacoff-backend.vercel.app/orders');
      const rawData = res.data;

      const groupedData = rawData.reduce((acc, item) => {
        if (!acc[item.id_order]) {
          acc[item.id_order] = {
            id_order: item.id_order,
            nama_user: item.nama_user,
            total_pesanan: item.total_pesanan,
            status: item.status,
            created_at: item.created_at,
            produk: []
          };
        }

        // Tambahkan produk hanya jika data lengkap
        if (item.nama_produk && item.jumlah) {
          acc[item.id_order].produk.push(`${item.nama_produk} x ${item.jumlah}`);
        }

        return acc;
      }, {});

      // Sort data: unpaid/canceled first, then paid
      const sortedData = Object.values(groupedData).sort((a, b) => {
        const statusPriority = { 'pending': 1, 'canceled': 2, 'paid': 3 };
        const priorityA = statusPriority[a.status] || 4;
        const priorityB = statusPriority[b.status] || 4;
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // If same priority, sort by date (newest first)
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id_order, newStatus) => {
    try {
      await axios.patch(`https://seacoff-backend.vercel.app/api/orders/${id_order}/status`, {
        status: newStatus
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Gagal update status:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Laporan Riwayat Penjualan', 14, 22);
    
    // Add export date
    doc.setFontSize(11);
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);
    
    // Prepare table data
    const tableData = data.map(item => [
      item.id_order,
      item.nama_user,
      `Rp ${parseFloat(item.total_pesanan).toLocaleString()}`,
      item.produk.length > 0 ? item.produk.join(', ') : '-',
      item.status,
      formatDate(item.created_at)
    ]);
    
    // Add table
    doc.autoTable({
      head: [['ID Order', 'Nama User', 'Total', 'Produk', 'Status', 'Tanggal']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [78, 84, 200] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 50 },
        4: { cellWidth: 20 },
        5: { cellWidth: 35 }
      }
    });
    
    // Save the PDF
    doc.save(`riwayat-penjualan-${new Date().toISOString().split('T')[0]}.pdf`);
  };

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
            <Link to="/menu-page" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Restaurant Orders</h1>
          <button 
            onClick={exportToPDF}
            style={{
              backgroundColor: '#4e54c8',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📄 Export PDF
          </button>
        </div>

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
                <th style={th}>ID Order</th>
                <th style={th}>Nama User</th>
                <th style={th}>Total</th>
                <th style={th}>Produk</th>
                <th style={th}>Status</th>
                <th style={th}>Tanggal</th>
                <th style={th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td style={td}>{item.id_order}</td>
                  <td style={td}>{item.nama_user}</td>
                  <td style={td}>Rp {parseFloat(item.total_pesanan).toLocaleString()}</td>
                  <td style={td}>
                    {item.produk.length > 0 ? item.produk.join(', ') : '-'}
                  </td>
                  <td style={td}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        item.status === 'paid' ? '#d4edda' :
                        item.status === 'pending' ? '#fff3cd' : '#f8d7da',
                      color:
                        item.status === 'paid' ? '#155724' :
                        item.status === 'pending' ? '#856404' : '#721c24'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={td}>{formatDate(item.created_at)}</td>
                  <td style={td}>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id_order, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const th = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left'
};

const td = {
  padding: '8px',
  border: '1px solid #ddd'
};

export default RiwayatPenjualan;
