// ============================================================
//  backend/server.js
//  Main Express server entry point
// ============================================================

require('dotenv').config();                      // Load .env variables first
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());                                 // Allow frontend to call API
app.use(express.json());                         // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ── Serve static frontend files ────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/courses',     require('./routes/courses'));
app.use('/api/students',    require('./routes/students'));

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' });
});

// ── Catch-all: serve frontend for any other route ──────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── 404 handler for unknown API paths ──────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Student Management System is running!');
    console.log(`   Local URL : http://localhost:${PORT}`);
    console.log(`   API base  : http://localhost:${PORT}/api`);
    console.log('   Press Ctrl+C to stop the server.');
    console.log('');
});
