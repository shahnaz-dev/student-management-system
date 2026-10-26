-- ============================================================
--  Student Management System - Sample Data
--  File: database/sample_data.sql
--  Run this file AFTER schema.sql
-- ============================================================

USE student_management;

-- ============================================================
--  Insert Departments (3 departments)
-- ============================================================
INSERT INTO departments (dept_name) VALUES
    ('Computer Science'),
    ('Electronics & Communication'),
    ('Mechanical Engineering');

-- ============================================================
--  Insert Courses (4 courses across departments)
-- ============================================================
INSERT INTO courses (course_name, dept_id) VALUES
    ('B.Tech Computer Science',          1),
    ('B.Tech Artificial Intelligence',   1),
    ('B.Tech Electronics',               2),
    ('B.Tech Mechanical',                3);

-- ============================================================
--  Insert Students (10 students)
-- ============================================================
INSERT INTO students (roll_number, full_name, email, phone, dept_id, course_id) VALUES
    ('CS2021001', 'Aarav Sharma',       'aarav.sharma@college.edu',       '9876543210', 1, 1),
    ('CS2021002', 'Priya Mehta',        'priya.mehta@college.edu',        '9876543211', 1, 1),
    ('AI2021001', 'Rohan Verma',        'rohan.verma@college.edu',        '9876543212', 1, 2),
    ('AI2021002', 'Sneha Patel',        'sneha.patel@college.edu',        '9876543213', 1, 2),
    ('AI2021003', 'Karan Singh',        'karan.singh@college.edu',        '9876543214', 1, 2),
    ('EC2021001', 'Anjali Gupta',       'anjali.gupta@college.edu',       '9876543215', 2, 3),
    ('EC2021002', 'Vikram Nair',        'vikram.nair@college.edu',        '9876543216', 2, 3),
    ('EC2021003', 'Meera Joshi',        'meera.joshi@college.edu',        '9876543217', 2, 3),
    ('ME2021001', 'Arjun Reddy',        'arjun.reddy@college.edu',        '9876543218', 3, 4),
    ('ME2021002', 'Pooja Yadav',        'pooja.yadav@college.edu',        '9876543219', 3, 4);
