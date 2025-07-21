// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Folder untuk data
const dataPath = path.join(__dirname, 'data');
const usersFile = path.join(dataPath, 'users.json');

// Endpoint pengecekan server
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong! Server hidup 🎉' });
});

// Endpoint ambil semua user
app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(usersFile, 'utf-8');
  res.json(JSON.parse(data));
});

// Endpoint simpan/update user
app.post('/api/user', (req, res) => {
  const { nama, coins, xp, level } = req.body;

  if (!nama) {
    return res.status(400).json({ error: 'Nama harus disertakan' });
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  } catch (e) {
    users = [];
  }

  const existing = users.find(u => u.nama === nama);
  if (existing) {
    existing.coins = coins;
    existing.xp = xp;
    existing.level = level;
  } else {
    users.push({ nama, coins, xp, level });
  }

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ success: true, message: 'Data disimpan' });
});

// Endpoint untuk reset semua user (admin)
app.post('/api/admin/reset', (req, res) => {
  const { kode } = req.body;
  if (kode !== 'vareset2025') {
    return res.status(403).json({ error: 'Kode admin salah' });
  }

  fs.writeFileSync(usersFile, '[]');
  res.json({ success: true, message: 'Semua data pengguna berhasil direset' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
