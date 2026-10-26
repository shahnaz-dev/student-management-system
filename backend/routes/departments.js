// ============================================================
//  backend/routes/departments.js
//  REST API routes for Department management
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/departments  →  List all departments ──────────
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM departments ORDER BY dept_name ASC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('GET /departments error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── POST /api/departments  →  Add a new department ─────────
router.post('/', async (req, res) => {
    const { dept_name } = req.body;

    // Validate required field
    if (!dept_name || dept_name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Department name is required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO departments (dept_name) VALUES (?)',
            [dept_name.trim()]
        );
        res.status(201).json({
            success: true,
            message: 'Department added successfully!',
            data: { dept_id: result.insertId, dept_name: dept_name.trim() }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Department already exists.' });
        }
        console.error('POST /departments error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── DELETE /api/departments/:id  →  Delete a department ────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM departments WHERE dept_id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }
        res.json({ success: true, message: 'Department deleted successfully!' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete: students or courses are linked to this department.'
            });
        }
        console.error('DELETE /departments error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

module.exports = router;
