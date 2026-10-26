-- ============================================================
--  Student Management System - Important SQL Queries
--  File: database/queries.sql
--  This file demonstrates all key SQL operations for the assignment.
-- ============================================================

USE student_management;

-- ============================================================
--  1. CREATE  (already in schema.sql — shown here for reference)
-- ============================================================
-- CREATE TABLE departments ( dept_id INT AUTO_INCREMENT PRIMARY KEY, dept_name VARCHAR(100) NOT NULL UNIQUE );


-- ============================================================
--  2. INSERT - Add a new student
-- ============================================================
INSERT INTO students (roll_number, full_name, email, phone, dept_id, course_id)
VALUES ('CS2022010', 'Riya Kapoor', 'riya.kapoor@college.edu', '9998887770', 1, 1);


-- ============================================================
--  3. SELECT - Get all students with department and course names
-- ============================================================
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    s.email,
    s.phone,
    d.dept_name,
    c.course_name,
    s.created_at
FROM students s
JOIN departments d ON s.dept_id = d.dept_id
JOIN courses    c ON s.course_id = c.course_id
ORDER BY s.roll_number ASC;


-- ============================================================
--  4. WHERE - Search student by name or roll number
-- ============================================================
SELECT s.roll_number, s.full_name, s.email, d.dept_name
FROM students s
JOIN departments d ON s.dept_id = d.dept_id
WHERE s.full_name LIKE '%Aarav%'
   OR s.roll_number LIKE '%CS2021%';


-- ============================================================
--  5. UPDATE - Update a student's phone number and course
-- ============================================================
UPDATE students
SET phone = '9111222333', course_id = 2
WHERE roll_number = 'CS2021001';


-- ============================================================
--  6. DELETE - Delete a student by roll number
-- ============================================================
DELETE FROM students
WHERE roll_number = 'CS2022010';


-- ============================================================
--  7. ORDER BY - List students alphabetically by name
-- ============================================================
SELECT roll_number, full_name, email
FROM students
ORDER BY full_name ASC;


-- ============================================================
--  8. GROUP BY + COUNT - Count students per department
-- ============================================================
SELECT
    d.dept_name,
    COUNT(s.student_id) AS total_students
FROM departments d
LEFT JOIN students s ON d.dept_id = s.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY total_students DESC;


-- ============================================================
--  9. GROUP BY + COUNT - Count students per course
-- ============================================================
SELECT
    c.course_name,
    d.dept_name,
    COUNT(s.student_id) AS total_students
FROM courses c
JOIN departments d ON c.dept_id = d.dept_id
LEFT JOIN students s ON s.course_id = c.course_id
GROUP BY c.course_id, c.course_name, d.dept_name
ORDER BY total_students DESC;


-- ============================================================
-- 10. JOIN - List all courses with their department names
-- ============================================================
SELECT
    c.course_id,
    c.course_name,
    d.dept_name
FROM courses c
JOIN departments d ON c.dept_id = d.dept_id
ORDER BY d.dept_name, c.course_name;


-- ============================================================
-- 11. SUBQUERY - Find students enrolled in Computer Science department
-- ============================================================
SELECT roll_number, full_name, email
FROM students
WHERE dept_id = (
    SELECT dept_id
    FROM departments
    WHERE dept_name = 'Computer Science'
)
ORDER BY full_name;


-- ============================================================
-- 12. Aggregate - Dashboard statistics (total counts)
-- ============================================================
SELECT
    (SELECT COUNT(*) FROM students)    AS total_students,
    (SELECT COUNT(*) FROM courses)     AS total_courses,
    (SELECT COUNT(*) FROM departments) AS total_departments;
