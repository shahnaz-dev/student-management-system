-- ============================================================
--  Student Management System - Database Schema
--  File: database/schema.sql
--  Run this file FIRST before sample_data.sql
-- ============================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS student_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE student_management;

-- ============================================================
--  TABLE 1: departments
--  Stores all departments in the college
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    dept_id   INT          AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
--  TABLE 2: courses
--  Stores all courses, each belonging to one department
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    course_id   INT          AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    dept_id     INT          NOT NULL,
    CONSTRAINT fk_course_dept
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uq_course_dept UNIQUE (course_name, dept_id)
);

-- ============================================================
--  TABLE 3: students
--  Stores all student records
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    student_id  INT          AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20)  NOT NULL UNIQUE,
    full_name   VARCHAR(150) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    phone       VARCHAR(15),
    dept_id     INT          NOT NULL,
    course_id   INT          NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_dept
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_student_course
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
