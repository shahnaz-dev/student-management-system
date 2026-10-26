# Student Management System
## DBMS Assignment – 3 | Project Report

**Submitted by:** [Your Name]
**Roll Number:** [Your Roll Number]
**Course:** [Your Course Name]
**Department:** [Your Department]
**Subject:** Database Management Systems (DBMS)
**Submitted to:** [Professor's Name]
**Date:** October 2024

---

## 1. Project Title

**Student Management System**
*A web-based application to manage student records, courses, and departments using MySQL, Node.js, Express.js, and Vanilla JavaScript.*

---

## 2. Abstract

The Student Management System is a full-stack web application designed to manage the academic records of college students. The system provides a clean, modern graphical interface for performing CRUD (Create, Read, Update, Delete) operations on student records. It uses a relational MySQL database to store and retrieve data efficiently, with a Node.js/Express.js REST API as the backend and HTML/CSS/JavaScript as the frontend. The project demonstrates real-world application of core DBMS concepts including table design, normalization, SQL queries, joins, foreign keys, and parameterized queries for security.

---

## 3. Introduction

Educational institutions deal with large amounts of student data every day. Manually maintaining this data in registers or spreadsheets is inefficient and error-prone. A Student Management System automates this process by storing all records in an organized relational database, allowing instant search, edit, and retrieval.

This project was developed as part of the DBMS Assignment-3 to apply theoretical database concepts in a practical, real-world scenario.

---

## 4. Problem Statement

College administration often faces challenges such as:

- Difficulty in searching and retrieving student information quickly.
- Risk of duplicate records and data inconsistency.
- No structured relationship between students, courses, and departments.
- Manual record-keeping is slow and error-prone.

This project addresses these problems by building a web-based Student Management System backed by a properly designed relational database.

---

## 5. Objectives

1. Design a normalized relational database for storing student, course, and department data.
2. Implement a REST API backend using Node.js and Express.js.
3. Build a responsive, user-friendly frontend interface.
4. Apply core SQL operations: CREATE, INSERT, SELECT, UPDATE, DELETE, JOIN, GROUP BY, ORDER BY, and Subqueries.
5. Use parameterized queries to prevent SQL Injection.
6. Use environment variables to keep database credentials secure.
7. Provide a dashboard showing key statistics about enrolled students.

---

## 6. Hardware and Software Requirements

### Hardware Requirements
| Component | Minimum Requirement |
|-----------|---------------------|
| Processor | Intel Core i3 or equivalent |
| RAM       | 4 GB |
| Storage   | 10 GB free disk space |
| Network   | Not required (local use) |

### Software Requirements
| Software | Version | Purpose |
|----------|---------|---------|
| Windows OS | 10/11 | Operating System |
| Node.js | v18 or above | Backend runtime |
| npm | v9 or above | Package manager |
| MySQL Community Server | 8.0 | Relational database |
| MySQL Workbench | 8.0 | Database GUI |
| Web Browser | Chrome / Firefox | Frontend access |
| VS Code (optional) | Latest | Code editor |

---

## 7. System Architecture

The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────┐
│           PRESENTATION TIER             │
│  HTML + CSS + JavaScript (Bootstrap 5)  │
│       Runs in the Web Browser           │
└────────────────┬────────────────────────┘
                 │  HTTP REST API (fetch)
┌────────────────▼────────────────────────┐
│            APPLICATION TIER             │
│    Node.js + Express.js (server.js)     │
│   Routes: /api/students /api/courses    │
│   Routes: /api/departments /api/dashboard│
└────────────────┬────────────────────────┘
                 │  mysql2 (connection pool)
┌────────────────▼────────────────────────┐
│              DATA TIER                  │
│       MySQL 8.0 (localhost:3306)        │
│     Database: student_management        │
│  Tables: departments, courses, students │
└─────────────────────────────────────────┘
```

### Data Flow
1. User opens the browser → loads `index.html` from the Express static server.
2. JavaScript makes `fetch()` calls to REST API endpoints.
3. Express routes handle each request and run parameterized SQL queries.
4. MySQL returns data → Express sends JSON response → JS updates the UI.

---

## 8. ER Diagram

*(See `docs/er-diagram.md` for the full Mermaid ER diagram)*

```
DEPARTMENTS ─────────────── COURSES
     │  dept_id (PK)              │  course_id (PK)
     │  dept_name (UNIQUE)        │  course_name
     │                            │  dept_id (FK → departments)
     │
     └──────────── STUDENTS
                        │  student_id (PK)
                        │  roll_number (UNIQUE)
                        │  full_name
                        │  email (UNIQUE)
                        │  phone
                        │  dept_id (FK → departments)
                        │  course_id (FK → courses)
                        │  created_at
```

**Relationships:**
- `DEPARTMENTS` → `COURSES`: One-to-Many (1 department offers many courses)
- `DEPARTMENTS` → `STUDENTS`: One-to-Many (1 department has many students)
- `COURSES` → `STUDENTS`: One-to-Many (1 course enrolls many students)

---

## 9. Relational Schema

```sql
departments (dept_id PK, dept_name UNIQUE NOT NULL)

courses (course_id PK, course_name NOT NULL, dept_id FK NOT NULL)
         FK: dept_id → departments(dept_id)

students (student_id PK, roll_number UNIQUE NOT NULL, full_name NOT NULL,
          email UNIQUE NOT NULL, phone, dept_id FK, course_id FK, created_at)
         FK: dept_id   → departments(dept_id)
         FK: course_id → courses(course_id)
```

---

## 10. Table Descriptions and Keys

### Table: `departments`
| Column | Data Type | Constraint | Description |
|--------|-----------|------------|-------------|
| dept_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| dept_name | VARCHAR(100) | NOT NULL, UNIQUE | Department name |

### Table: `courses`
| Column | Data Type | Constraint | Description |
|--------|-----------|------------|-------------|
| course_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| course_name | VARCHAR(150) | NOT NULL | Name of the course |
| dept_id | INT | NOT NULL, FOREIGN KEY | Links to departments |

### Table: `students`
| Column | Data Type | Constraint | Description |
|--------|-----------|------------|-------------|
| student_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| roll_number | VARCHAR(20) | NOT NULL, UNIQUE | Student roll number |
| full_name | VARCHAR(150) | NOT NULL | Student's full name |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Student's email |
| phone | VARCHAR(15) | NULL allowed | Contact number |
| dept_id | INT | NOT NULL, FOREIGN KEY | Links to departments |
| course_id | INT | NOT NULL, FOREIGN KEY | Links to courses |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

---

## 11. Important SQL Queries with Explanations

### Q1. CREATE TABLE — departments
```sql
CREATE TABLE departments (
    dept_id   INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);
```
**Explanation:** Creates the `departments` table with an auto-incrementing primary key and a unique department name.

---

### Q2. INSERT — Add a student
```sql
INSERT INTO students (roll_number, full_name, email, phone, dept_id, course_id)
VALUES ('CS2021001', 'Aarav Sharma', 'aarav@college.edu', '9876543210', 1, 1);
```
**Explanation:** Inserts a new student record into the `students` table. Parameterized in the backend to prevent SQL injection.

---

### Q3. SELECT with JOIN — Get all students
```sql
SELECT s.roll_number, s.full_name, d.dept_name, c.course_name
FROM students s
JOIN departments d ON s.dept_id   = d.dept_id
JOIN courses     c ON s.course_id = c.course_id
ORDER BY s.roll_number ASC;
```
**Explanation:** Uses `INNER JOIN` to combine data from three tables. `ORDER BY` sorts the result alphabetically by roll number.

---

### Q4. WHERE — Search student
```sql
SELECT * FROM students
WHERE full_name LIKE '%Aarav%' OR roll_number LIKE '%CS2021%';
```
**Explanation:** `WHERE` with `LIKE` is used for partial text search across name and roll number fields.

---

### Q5. UPDATE — Edit student details
```sql
UPDATE students
SET phone = '9111222333', course_id = 2
WHERE student_id = 1;
```
**Explanation:** Updates specific columns of a student record using the `WHERE` clause to target only one row.

---

### Q6. DELETE — Remove a student
```sql
DELETE FROM students WHERE student_id = 5;
```
**Explanation:** Permanently deletes the student with the given ID. Foreign key constraints prevent deleting departments/courses that still have students.

---

### Q7. GROUP BY + COUNT — Students per department
```sql
SELECT d.dept_name, COUNT(s.student_id) AS total_students
FROM departments d
LEFT JOIN students s ON d.dept_id = s.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY total_students DESC;
```
**Explanation:** `GROUP BY` groups records by department. `COUNT()` counts students per group. `LEFT JOIN` ensures departments with zero students also appear.

---

### Q8. Subquery — Students in a specific department
```sql
SELECT roll_number, full_name
FROM students
WHERE dept_id = (
    SELECT dept_id FROM departments WHERE dept_name = 'Computer Science'
);
```
**Explanation:** A **subquery** in the `WHERE` clause first fetches the `dept_id` for 'Computer Science', then the outer query uses it to filter students.

---

### Q9. Dashboard Statistics (Multiple aggregates)
```sql
SELECT
    (SELECT COUNT(*) FROM students)    AS total_students,
    (SELECT COUNT(*) FROM courses)     AS total_courses,
    (SELECT COUNT(*) FROM departments) AS total_departments;
```
**Explanation:** Three scalar subqueries run in a single SELECT to get dashboard counts efficiently.

---

## 12. Testing and Results

> ⚠️ **Note:** The following tests describe expected behavior. Actual test execution requires MySQL Server to be installed and running. The code was written following all constraints; actual runtime testing was not performed at code-generation time.

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add student with all fields | Valid data | Student added, shown in table | ✅ (by design) |
| Add duplicate roll number | Existing roll no. | Error: "Roll number already exists" | ✅ (by design) |
| Add student with missing name | Empty name field | Error: "Full name is required" | ✅ (by design) |
| Search by name | "Aarav" | Shows matching students | ✅ (by design) |
| Edit student email | New email | Record updated in DB | ✅ (by design) |
| Delete student | Click delete | Confirms, then removes record | ✅ (by design) |
| Delete dept with students | Attempt delete | Error: "linked students" | ✅ (by design) |
| Dashboard statistics | Load app | Shows correct counts | ✅ (by design) |
| Server offline | No Node.js running | Error banner shown | ✅ (by design) |

---

## 13. Advantages and Limitations

### Advantages
1. **Easy to use** — Simple, clean interface suitable for college use.
2. **Data integrity** — Foreign keys and UNIQUE constraints prevent bad data.
3. **Secure** — Parameterized queries prevent SQL injection. `.env` file protects credentials.
4. **No cloud needed** — Runs 100% locally on any laptop.
5. **Responsive** — Works on both desktop and mobile browsers.
6. **Real-time feedback** — Toast notifications for every action.

### Limitations
1. **No authentication** — Anyone with access to the URL can use the system.
2. **Single user** — No user roles (admin, teacher, student).
3. **Local only** — Designed for local use; not configured for production.
4. **No attendance or grades** — Only manages basic student records.
5. **Basic search** — Does not support advanced filtering or sorting.

---

## 14. Conclusion and Future Scope

### Conclusion
The Student Management System successfully demonstrates the practical application of DBMS concepts including relational database design, SQL queries, joins, normalization, constraints, and parameterized queries. The system provides a functional, user-friendly interface for managing student data at the local level.

### Future Scope
1. **Add authentication** — Login page with JWT tokens for teachers/admin.
2. **Grades and attendance** — Track marks and attendance per semester.
3. **Reports and export** — Generate PDF reports and export data to Excel.
4. **Advanced search** — Filter by course, department, or date range.
5. **Cloud deployment** — Host on a college server for multi-user access.
6. **Student portal** — Allow students to view their own records.

---

## References
1. MySQL 8.0 Reference Manual — https://dev.mysql.com/doc/
2. Express.js Documentation — https://expressjs.com/
3. Node.js Documentation — https://nodejs.org/en/docs/
4. Bootstrap 5 Documentation — https://getbootstrap.com/docs/5.3/
5. W3Schools SQL Tutorial — https://www.w3schools.com/sql/
6. MDN Web Docs (JavaScript fetch) — https://developer.mozilla.org/

---
*End of Report*
