'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_KEY = process.env.ADMIN_KEY || '';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ── Remove server fingerprint ────────────────────────────────────
app.disable('x-powered-by');

// ── HTTPS redirect (Railway sets X-Forwarded-Proto) ──────────────
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// ── Security headers ─────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  next();
});

// ── Rate limiting (simple in-memory) ─────────────────────────────
const hits = new Map();
function rateLimit(maxReqs, windowMs) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const now = Date.now();
    const entry = hits.get(ip) || { count: 0, start: now };
    if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
    entry.count++;
    hits.set(ip, entry);
    if (entry.count > maxReqs) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

// ── Admin auth middleware ─────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) {
    return res.status(503).json({ error: 'Admin access not configured.' });
  }
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API: save a new client inquiry ──────────────────────────────
app.post('/api/inquiry', rateLimit(5, 60 * 1000), (req, res) => {
  try {
    const { name, contact, service, message } = req.body;

    // Validate required fields
    if (!name || !contact) {
      return res.status(400).json({ error: 'Name and contact are required.' });
    }
    // Enforce length limits
    if (name.length > 200 || contact.length > 200 || (service && service.length > 200) || (message && message.length > 2000)) {
      return res.status(400).json({ error: 'Input too long.' });
    }

    let list = [];
    if (fs.existsSync(DATA_FILE)) {
      try { list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch (_) {}
    }

    list.unshift({
      id:      Date.now(),
      name:    String(name).trim(),
      contact: String(contact).trim(),
      service: String(service || '').trim() || 'Not specified',
      message: String(message || '').trim(),
      date:    new Date().toISOString(),
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Inquiry save error');
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── API: fetch all inquiries (admin-only) ────────────────────────
app.get('/api/inquiries', requireAdmin, (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
  } catch (_) { res.json([]); }
});

// ── Admin page (requires key in query string) ────────────────────
app.get('/inquiries', (req, res) => {
  if (!ADMIN_KEY || req.query.key !== ADMIN_KEY) {
    return res.status(401).send('Unauthorized. Append ?key=YOUR_ADMIN_KEY to access.');
  }
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
