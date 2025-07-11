import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// CSS untuk memastikan modal di tengah
const modalStyles = `
  .modal-dialog-centered {
    display: flex !important;
    align-items: center !important;
    min-height: calc(100% - 1rem) !important;
    margin: 0.5rem auto !important;
  }
  
  .modal-dialog {
    margin: 0 auto !important;
    max-width: 500px !important;
  }
  
  .modal {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 15px !important;
  }
  
  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 500px !important;
      margin: 1.75rem auto !important;
    }
    
    .modal-dialog-centered {
      min-height: calc(100% - 3.5rem) !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = modalStyles;
  document.head.appendChild(styleElement);
}

const MenuPage = () => {
  const location = useLocation();

  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Field untuk tambah
  const [namaMenu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [foto, setFoto] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("makanan");

  // Field untuk edit
  const [selectedMenu, setSelectedMenu] = useState(null);
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
      const response = await axios.get(
        "https://seacoff-backend.vercel.app/api/menu"
      );
      setMenu(response.data);
    } catch {
      showToast("Gagal mengambil data menu", "#f44336");
    }
  };

  const showToast = (message, backgroundColor = "#4CAF50") => {
    const toast = document.createElement("div");
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "8px",
      zIndex: 9999,
      fontSize: "16px",
      opacity: "0",
      transition: "opacity 0.3s ease",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = "1"));

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
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

      await axios.post(
        "https://seacoff-backend.vercel.app/api/menu",
        formData
      );

      showToast("Menu berhasil ditambahkan");
      setShowAddModal(false);
      setNamaMenu("");
      setHarga("");
      setDeskripsi("");
      setKategori("makanan");
      setFoto(null);
      getMenu();
    } catch {
      showToast("Gagal menambahkan menu", "#f44336");
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
        formData
      );

      showToast("Menu berhasil diupdate");
      setShowEditModal(false);
      getMenu();
    } catch {
      showToast("Gagal update menu", "#f44336");
    }
  };

  const deleteMenu = async (id_menu) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;
    try {
      await axios.delete(
        `https://seacoff-backend.vercel.app/api/menu/${id_menu}`
      );
      showToast("Menu berhasil dihapus", "#ff9800");
      getMenu();
    } catch {
      showToast("Gagal menghapus menu", "#f44336");
    }
  };

  const filteredMenu = menu.filter((item) =>
    item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
        {/* Sidebar */}
        <div style={{ width: "240px", background: "linear-gradient(to bottom, #4e54c8, #8f94fb)", color: "#fff", padding: "20px" }}>
          <div style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "30px" }}>F.</div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "20px" }}><Link to="/dashboard" style={{ color: "#fff" }}>📊 Dashboard</Link></li>
            <li style={{ marginBottom: "20px", backgroundColor: location.pathname === "/menu-page" ? "rgba(255, 255, 255, 0.2)" : "transparent", padding: "10px", borderRadius: "8px" }}><Link to="/menu-page" style={{ color: "#fff" }}>🍽️ Menu</Link></li>
            <li style={{ marginBottom: "20px" }}><Link to="/riwayat-penjualan" style={{ color: "#fff" }}>📜 Riwayat</Link></li>
          </ul>
        </div>

        {/* Konten utama */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Daftar Menu</h1>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Tambah Menu Baru
            </Button>
            <Form.Control
              type="text"
              placeholder="Cari menu..."
              style={{ width: "300px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table striped bordered hover responsive>
            <thead style={{ background: "#f0f0f0" }}>
              <tr>
                <th>No</th><th>Nama Menu</th><th>Deskripsi</th><th>Kategori</th><th>Harga</th><th>Gambar</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenu.length ? (
                filteredMenu.map((item, index) => (
                  <tr key={item.id_menu}>
                    <td>{index + 1}</td>
                    <td>{item.nama_menu}</td>
                    <td>{item.deskripsi}</td>
                    <td>{item.kategori}</td>
                    <td>Rp {item.harga}</td>
                    <td><img src={item.foto_menu} alt={item.nama_menu} width="100" /></td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(item)}><PencilSquare /></Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => deleteMenu(item.id_menu)}><Trash /></Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center">Tidak ada data menu</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal Tambah */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog-centered"
        className="custom-modal"
      >
        <Modal.Header closeButton style={{ borderBottom: "1px solid #dee2e6" }}>
          <Modal.Title>Tambah Menu Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Masukkan nama menu"
                value={namaMenu} 
                onChange={(e) => setNamaMenu(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Masukkan deskripsi menu"
                value={deskripsi} 
                onChange={(e) => setDeskripsi(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Masukkan harga"
                value={harga} 
                onChange={(e) => setHarga(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gambar</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #dee2e6", padding: "15px 20px" }}>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddMenu}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog-centered"
        className="custom-modal"
      >
        <Modal.Header closeButton style={{ borderBottom: "1px solid #dee2e6" }}>
          <Modal.Title>Edit Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control 
                type="text"
                value={editNama} 
                onChange={(e) => setEditNama(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={editDeskripsi} 
                onChange={(e) => setEditDeskripsi(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select value={editKategori} onChange={(e) => setEditKategori(e.target.value)}>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control 
                type="number" 
                value={editHarga} 
                onChange={(e) => setEditHarga(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ganti Gambar (opsional)</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => setEditFoto(e.target.files[0])} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #dee2e6", padding: "15px 20px" }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MenuPage;