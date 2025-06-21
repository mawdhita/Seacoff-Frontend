import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2, X, Upload, Menu } from "lucide-react";

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [namaMenu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [foto, setFoto] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("makanan");

  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editFoto, setEditFoto] = useState(null);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editKategori, setEditKategori] = useState("makanan");

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const response = await axios.get("https://seacoff-backend.vercel.app/api/menu");
      setMenu(response.data);
    } catch (error) {
      showToast("Gagal mengambil data menu", "error");
    }
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.textContent = message;
    
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-orange-500"
    };
    
    toast.className = `fixed top-6 right-6 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
      toast.classList.add("translate-x-full");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleAddMenu = async () => {
    try {
      const formData = new FormData();
      formData.append("nama_menu", namaMenu);
      formData.append("harga", harga);
      formData.append("deskripsi", deskripsi);
      formData.append("kategori", kategori);
      formData.append("foto_menu", foto);

      await axios.post("https://seacoff-backend.vercel.app/api/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Menu berhasil ditambahkan");
      setShowAddModal(false);
      setNamaMenu("");
      setHarga("");
      setDeskripsi("");
      setKategori("makanan");
      setFoto(null);
      getMenu();
    } catch (error) {
      showToast("Gagal menambahkan menu", "error");
    }
  };

  const handleEdit = (menuItem) => {
    setSelectedMenu(menuItem);
    setEditNama(menuItem.nama_menu);
    setEditHarga(menuItem.harga);
    setEditDeskripsi(menuItem.deskripsi || "");
    setEditKategori(menuItem.kategori || "makanan");
    setEditFoto(null);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("nama_menu", editNama);
      formData.append("harga", editHarga);
      formData.append("deskripsi", editDeskripsi);
      formData.append("kategori", editKategori);
      if (editFoto) formData.append("foto_menu", editFoto);

      await axios.put(
        `https://seacoff-backend.vercel.app/api/menu/${selectedMenu.id_menu}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showToast("Menu berhasil diupdate");
      setShowEditModal(false);
      getMenu();
    } catch (error) {
      showToast("Gagal update menu", "error");
    }
  };

  const deleteMenu = async (id_menu) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      await axios.delete(`https://seacoff-backend.vercel.app/api/menu/${id_menu}`);
      showToast("Menu berhasil dihapus", "warning");
      getMenu();
    } catch (error) {
      showToast("Gagal menghapus menu", "error");
    }
  };

  const filteredMenu = menu.filter((item) =>
    item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-white text-xl font-bold">FoodAdmin</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors">
              <span className="mr-3">📊</span>
              Dashboard
            </a>
            <a href="/menu-page" className="flex items-center px-4 py-3 text-white bg-white bg-opacity-20 rounded-xl">
              <span className="mr-3">🍽️</span>
              Menu
            </a>
            <a href="/riwayat-penjualan" className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors">
              <span className="mr-3">📜</span>
              Riwayat
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden mr-4"
              >
                <MenuIcon size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Daftar Menu</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Tambah Menu Baru
            </button>
            
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <div key={item.id_menu} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                    <img
                      src={`https://seacoff-backend.vercel.app/uploads/${item.foto_menu}`}
                      alt={item.nama_menu}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 truncate">{item.nama_menu}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.kategori === 'makanan' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.kategori}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        Rp {Number(item.harga).toLocaleString('id-ID')}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMenu(item.id_menu)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Tidak ada menu ditemukan</div>
                <p className="text-gray-500">Coba ubah kata kunci pencarian atau tambah menu baru</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Menu Baru"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
            <input
              type="text"
              value={namaMenu}
              onChange={(e) => setNamaMenu(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Pilih gambar</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFoto(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleAddMenu}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Menu"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
            <input
              type="text"
              value={editNama}
              onChange={(e) => setEditNama(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={editDeskripsi}
              onChange={(e) => setEditDeskripsi(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={editKategori}
              onChange={(e) => setEditKategori(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
            <input
              type="number"
              value={editHarga}
              onChange={(e) => setEditHarga(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ganti Gambar (opsional)</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Pilih gambar baru</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setEditFoto(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;