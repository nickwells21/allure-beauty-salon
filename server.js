'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API: save a new client inquiry ──────────────────────────────
app.post('/api/inquiry', (req, res) => {
  try {
    const { name, contact, service, message } = req.body;
    if (!name || !contact) {
      return res.status(400).json({ error: 'Name and contact are required.' });
    }

    let list = [];
    if (fs.existsSync(DATA_FILE)) {
      try { list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch (_) {}
    }

    list.unshift({
      id:      Date.now(),
      name:    name.trim(),
      contact: contact.trim(),
      service: (service || '').trim() || 'Not specified',
      message: (message || '').trim(),
      date:    new Date().toISOString(),
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Inquiry save error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── API: fetch all inquiries (for admin page) ────────────────────
app.get('/api/inquiries', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
  } catch (_) { res.json([]); }
});

// ── Admin page ───────────────────────────────────────────────────
app.get('/inquiries', (req, res) => {
  res.sendFile(path.join(__dirname, 'inquiries.html'));
});

// ── Static files ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  index: 'index.html',
}));

// ── Fallback ─────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Allure Beauty Salon running on port ${PORT}`);
});
