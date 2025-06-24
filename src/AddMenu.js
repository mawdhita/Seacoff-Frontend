import React, { useState } from "react";
import axios from "axios";

const AddMenu = ({ onSuccess }) => {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_menu", nama);
    formData.append("harga", harga);
    formData.append("foto_menu", gambar);

    try {
     await axios.post("https://seacoff-backend.vercel.app/api/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Menu berhasil ditambahkan");
      onSuccess(); // refresh menu
      setNama("");
      setHarga("");
      setGambar(null);
    } catch (error) {
      console.error("Gagal tambah menu", error);
      alert("Gagal menambahkan menu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div>
        <label>Nama Menu:</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div>
        <label>Harga:</label>
        <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} required />
      </div>
      <div>
        <label>Gambar:</label>
        <input type="file" onChange={(e) => setGambar(e.target.files[0])} required />
      </div>
      <button type="submit">Tambah Menu</button>
    </form>
  );
};

export default AddMenu;
