// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000; // Ganti sesuai kebutuhan, atau pakai process.env.PORT

app.use(express.json());

// Load data user dari file JSON
const dataPath = path.join(__dirname, 'data', 'users.json');
function loadUsers() {
  if (!fs.existsSync(dataPath)) return {};
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function saveUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

// === Endpoint: Penarikan ===
app.post('/api/tarik', (req, res) => {
  const { nama, coin } = req.body;
  const rate = 10; // Misal 1 coin = Rp10
  const minimal = 100; // Minimal coin untuk tarik

  if (!nama || typeof coin !== 'number') {
    return res.status(400).json({ sukses: false, pesan: 'Data tidak lengkap' });
  }

  if (coin < minimal) {
    return res.status(403).json({ sukses: false, pesan: 'Koin belum cukup untuk ditarik' });
  }

  const users = loadUsers();
  if (!users[nama]) {
    users[nama] = { totalTarik: 0, riwayat: [] };
  }

  const jumlahRupiah = coin * rate;
  const tanggal = new Date().toLocaleString('id-ID');

  // Simpan riwayat
  users[nama].riwayat.push({ tanggal, jumlah: jumlahRupiah });
  users[nama].totalTarik += jumlahRupiah;

  saveUsers(users);

  return res.json({
    sukses: true,
    pesan: `Penarikan berhasil. Rp${jumlahRupiah.toLocaleString('id-ID')} sedang diproses.`,
    data: {
      tanggal,
      jumlah: jumlahRupiah
    }
  });
});

// === Endpoint: Lihat Riwayat ===
app.get('/api/riwayat/:nama', (req, res) => {
  const nama = req.params.nama;
  const users = loadUsers();

  if (!users[nama]) {
    return res.json({ sukses: true, riwayat: [] });
  }

  return res.json({ sukses: true, riwayat: users[nama].riwayat });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
