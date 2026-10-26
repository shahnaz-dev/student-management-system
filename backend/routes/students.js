// ============================================================
//  backend/routes/students.js
//  REST API routes for Student management
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Helper: Base SELECT with JOINs (avoids repeating it)
const BASE_SELECT = `
    SELECT
        s.student_id,
        s.roll_number,
        s.full_name,
        s.email,
        s.phone,
        s.dept_id,
        s.course_id,
        d.dept_name,
        c.course_name,
        s.created_at
    FROM students s
    JOIN departments d ON s.dept_id   = d.dept_id
    JOIN courses     c ON s.course_id = c.course_id
`;

// ── GET /api/students  →  List all or search students ──────
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let query  = BASE_SELECT;
        let params = [];

        if (search && search.trim() !== '') {
            query += `
                WHERE s.full_name   LIKE ?
                   OR s.roll_number LIKE ?
            `;
            const term = `%${search.trim()}%`;
            params = [term, term];
        }

        query += ' ORDER BY s.roll_number ASC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('GET /students error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── GET /api/students/:id  →  Get single student ───────────
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            BASE_SELECT + ' WHERE s.student_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /students/:id error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── POST /api/students  →  Add a new student ───────────────
router.post('/', async (req, res) => {
    const { roll_number, full_name, email, phone, dept_id, course_id } = req.body;

    // --- Validation ---
    if (!roll_number || roll_number.trim() === '')
        return res.status(400).json({ success: false, message: 'Roll number is required.' });
    if (!full_name || full_name.trim() === '')
        return res.status(400).json({ success: false, message: 'Full name is required.' });
    if (!email || email.trim() === '')
        return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!dept_id)
        return res.status(400).json({ success: false, message: 'Department is required.' });
    if (!course_id)
        return res.status(400).json({ success: false, message: 'Course is required.' });

    try {
        const [result] = await db.query(
            `INSERT INTO students (roll_number, full_name, email, phone, dept_id, course_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                roll_number.trim(),
                full_name.trim(),
                email.trim(),
                phone ? phone.trim() : null,
                dept_id,
                course_id
            ]
        );
        res.status(201).json({
            success: true,
            message: 'Student added successfully!',
            data: { student_id: result.insertId }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            // Figure out which field caused the duplicate
            const msg = err.message.includes('roll_number')
                ? 'Roll number already exists.'
                : 'Email already exists.';
            return res.status(409).json({ success: false, message: msg });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ success: false, message: 'Invalid department or course selected.' });
        }
        console.error('POST /students error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── PUT /api/students/:id  →  Update a student ─────────────
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { roll_number, full_name, email, phone, dept_id, course_id } = req.body;

    // --- Validation ---
    if (!roll_number || roll_number.trim() === '')
        return res.status(400).json({ success: false, message: 'Roll number is required.' });
    if (!full_name || full_name.trim() === '')
        return res.status(400).json({ success: false, message: 'Full name is required.' });
    if (!email || email.trim() === '')
        return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!dept_id)
        return res.status(400).json({ success: false, message: 'Department is required.' });
    if (!course_id)
        return res.status(400).json({ success: false, message: 'Course is required.' });

    try {
        const [result] = await db.query(
            `UPDATE students
             SET roll_number = ?, full_name = ?, email = ?, phone = ?, dept_id = ?, course_id = ?
             WHERE student_id = ?`,
            [
                roll_number.trim(),
                full_name.trim(),
                email.trim(),
                phone ? phone.trim() : null,
                dept_id,
                course_id,
                id
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, message: 'Student updated successfully!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const msg = err.message.includes('roll_number')
                ? 'Roll number already exists.'
                : 'Email already exists.';
            return res.status(409).json({ success: false, message: msg });
        }
        console.error('PUT /students error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── DELETE /api/students/:id  →  Delete a student ──────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM students WHERE student_id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, message: 'Student deleted successfully!' });
    } catch (err) {
        console.error('DELETE /students error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

module.exports = router;
