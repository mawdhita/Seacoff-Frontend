import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";

const MenuPage = () => {
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [namaMenu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [foto, setFoto] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("makanan"); // default kategori

  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editFoto, setEditFoto] = useState(null);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editKategori, setEditKategori] = useState("makanan"); // default kategori

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const response = await axios.get("https://seacoff-backend.vercel.app/menus");
      setMenu(response.data);
    } catch (error) {
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
      fontWeight: "500",
      opacity: "0",
      transition: "opacity 0.3s ease",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
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

      await axios.post("https://seacoff-backend.vercel.app/menus", formData, {
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
        `https://seacoff-backend.vercel.app/menus/${selectedMenu.id_menu}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showToast("Menu berhasil diupdate");
      setShowEditModal(false);
      getMenu();
    } catch (error) {
      showToast("Gagal update menu", "#f44336");
    }
  };

  const deleteMenu = async (id_menu) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      await axios.delete(`https://seacoff-backend.vercel.app/menus/${id_menu}`);
      showToast("Menu berhasil dihapus", "#ff9800");
      getMenu();
    } catch (error) {
      showToast("Gagal menghapus menu", "#f44336");
    }
  };

  const filteredMenu = menu.filter((item) =>
    item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", background: "linear-gradient(to bottom, #4e54c8, #8f94fb)", color: "#fff", padding: "20px" }}>
        <div style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "30px" }}>F.</div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "20px" }}>
            <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center" }}>
              📊 <span style={{ marginLeft: "10px" }}>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: "20px", backgroundColor: location.pathname === "/menu" ? "rgba(255, 255, 255, 0.2)" : "transparent", padding: "10px", borderRadius: "8px" }}>
            <Link to="/menu" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center" }}>
              🍽️ <span style={{ marginLeft: "10px" }}>Menu</span>
            </Link>
          </li>
          <li style={{ marginBottom: "20px", backgroundColor: location.pathname === "/riwayat-penjualan" ? "rgba(255, 255, 255, 0.2)" : "transparent", padding: "10px", borderRadius: "8px" }}>
            <Link to="/riwayat-penjualan" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center" }}>
              📜 <span style={{ marginLeft: "10px" }}>Riwayat</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
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

        <Table striped bordered hover responsive style={{ background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>No</th>
              <th>Nama Menu</th>
              <th>Deskripsi</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item, index) => (
                <tr key={item.id_menu}>
                  <td>{index + 1}</td>
                  <td>{item.nama_menu}</td>
                  <td>{item.deskripsi}</td>
                  <td>{item.kategori}</td>
                  <td>Rp {item.harga}</td>
                  <td>
                    <img
                      src={`https://seacoff-backend.vercel.app/uploads/${item.foto_menu}`}
                      alt={item.nama_menu}
                      width="100"
                    />
                  </td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                      <PencilSquare />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteMenu(item.id_menu)}>
                      <Trash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Tidak ada data menu</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Tambah */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Menu Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control
                type="text"
                value={namaMenu}
                onChange={(e) => setNamaMenu(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Gambar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleAddMenu}>Simpan</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control
                type="text"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                value={editDeskripsi}
                onChange={(e) => setEditDeskripsi(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={editKategori}
                onChange={(e) => setEditKategori(e.target.value)}
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                value={editHarga}
                onChange={(e) => setEditHarga(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Ganti Gambar (opsional)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setEditFoto(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Batal</Button>
          <Button variant="success" onClick={handleUpdate}>Simpan Perubahan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuPage;
