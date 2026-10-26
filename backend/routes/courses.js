// ============================================================
//  backend/routes/courses.js
//  REST API routes for Course management
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/courses  →  List all courses with dept name ───
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.course_id, c.course_name, c.dept_id, d.dept_name
            FROM courses c
            JOIN departments d ON c.dept_id = d.dept_id
            ORDER BY d.dept_name ASC, c.course_name ASC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('GET /courses error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── POST /api/courses  →  Add a new course ─────────────────
router.post('/', async (req, res) => {
    const { course_name, dept_id } = req.body;

    if (!course_name || course_name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Course name is required.' });
    }
    if (!dept_id) {
        return res.status(400).json({ success: false, message: 'Department is required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO courses (course_name, dept_id) VALUES (?, ?)',
            [course_name.trim(), dept_id]
        );
        res.status(201).json({
            success: true,
            message: 'Course added successfully!',
            data: { course_id: result.insertId, course_name: course_name.trim(), dept_id }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This course already exists in the selected department.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ success: false, message: 'Selected department does not exist.' });
        }
        console.error('POST /courses error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// ── DELETE /api/courses/:id  →  Delete a course ────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'DELETE FROM courses WHERE course_id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.json({ success: true, message: 'Course deleted successfully!' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete: students are enrolled in this course.'
            });
        }
        console.error('DELETE /courses error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

module.exports = router;
