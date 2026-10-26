// ============================================================
//  backend/routes/dashboard.js
//  REST API route for Dashboard statistics
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/dashboard  →  Total counts for dashboard cards ─
router.get('/', async (req, res) => {
    try {
        // Run all count queries in parallel for better performance
        const [[students], [courses], [departments], [deptStats]] = await Promise.all([
            db.query('SELECT COUNT(*) AS total FROM students'),
            db.query('SELECT COUNT(*) AS total FROM courses'),
            db.query('SELECT COUNT(*) AS total FROM departments'),
            db.query(`
                SELECT d.dept_name, COUNT(s.student_id) AS student_count
                FROM departments d
                LEFT JOIN students s ON d.dept_id = s.dept_id
                GROUP BY d.dept_id, d.dept_name
                ORDER BY student_count DESC
            `)
        ]);

        res.json({
            success: true,
            data: {
                total_students   : students[0].total,
                total_courses    : courses[0].total,
                total_departments: departments[0].total,
                dept_stats       : deptStats
            }
        });
    } catch (err) {
        console.error('GET /dashboard error:', err.message);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

module.exports = router;
