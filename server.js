// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const USERS_PATH = './data/users.json';

// Endpoint ambil semua user
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH));
    res.json(users);
  } catch (err) {
    console.error('❌ Gagal baca file users.json:', err);
    res.status(500).send('Server error');
  }
});

// Endpoint tambah user (opsional)
app.post('/api/users', (req, res) => {
  try {
    const newUser = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_PATH));
    users.push(newUser);
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    res.send('OK');
  } catch (err) {
    console.error('❌ Gagal simpan:', err);
    res.status(500).send('Gagal simpan');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
