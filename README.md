# 📚 Student Management System
### DBMS Assignment — 3

A beginner-friendly, full-stack web application to manage students, courses, and departments using **Node.js**, **Express.js**, **MySQL**, and plain **HTML/CSS/JavaScript**.

---

## 🗂️ Project Structure

```
student-management-system/
├── frontend/
│   ├── index.html      ← Main UI page
│   ├── style.css       ← All custom styles
│   └── script.js       ← Frontend JavaScript (fetch API calls)
├── backend/
│   ├── server.js       ← Express server (entry point)
│   ├── db.js           ← MySQL connection pool
│   └── routes/
│       ├── students.js     ← /api/students
│       ├── courses.js      ← /api/courses
│       ├── departments.js  ← /api/departments
│       └── dashboard.js    ← /api/dashboard
├── database/
│   ├── schema.sql      ← Create tables (run first)
│   ├── sample_data.sql ← Insert sample data (run second)
│   └── queries.sql     ← All SQL query examples
├── docs/
│   ├── report.md       ← Full assignment report
│   └── er-diagram.md  ← ER diagram in Mermaid format
├── .env.example        ← Template for .env file
├── .gitignore
├── package.json
└── README.md           ← This file
```

---

## 🛠️ STEP-BY-STEP SETUP (Start here if nothing is installed)

### STEP 1 — Install Node.js

1. Go to: **https://nodejs.org/**
2. Download the **LTS** version (e.g., 20.x.x LTS).
3. Run the installer. Keep all default options. Click **Next** through every screen.
4. Restart your laptop after installation.
5. **Verify** — Open **PowerShell** and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v20.10.0` and `10.2.4`).

---

### STEP 2 — Install MySQL Community Server

1. Go to: **https://dev.mysql.com/downloads/mysql/**
2. Choose **MySQL Community Server 8.0** → **Windows (x86, 64-bit) MSI Installer**
3. Run the installer.
4. Choose **Developer Default** setup type.
5. On the **Accounts and Roles** screen, set a **root password**. **Remember this password!**
6. Keep all other defaults and finish the installation.
7. **Verify** — Open **PowerShell** and type:
   ```
   mysql --version
   ```
   You should see something like `mysql  Ver 8.0.xx`.

---

### STEP 3 — Install MySQL Workbench (optional but helpful)

MySQL Workbench is usually installed with MySQL. If not:
1. Go to: **https://dev.mysql.com/downloads/workbench/**
2. Download and install the Windows version.

---

### STEP 4 — Set up the Database

**Option A: Using MySQL Workbench (GUI)**
1. Open MySQL Workbench.
2. Click on **Local instance MySQL80** and enter your root password.
3. In the top menu, click **File → Open SQL Script**.
4. Navigate to your project folder → `database/` → select `schema.sql` → click Open.
5. Click the **⚡ (Execute)** button (or press `Ctrl+Shift+Enter`).
6. Repeat steps 3–5 for `sample_data.sql`.

**Option B: Using PowerShell**
```powershell
# Navigate to your project folder
cd "C:\Users\Admin\OneDrive\Desktop\student-management-system"

# Run schema (creates the database and tables)
mysql -u root -p < database\schema.sql

# Run sample data (inserts 10 students, 4 courses, 3 departments)
mysql -u root -p < database\sample_data.sql
```
Enter your MySQL root password when prompted.

---

### STEP 5 — Create your .env file

1. In the project folder, find `.env.example`.
2. Copy it and rename the copy to `.env` (no `.example`).
3. Open `.env` with Notepad and fill in your MySQL password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=student_management
PORT=3000
```

> ⚠️ Never share or upload your `.env` file. It is already in `.gitignore`.

---

### STEP 6 — Install Node.js Dependencies

Open **PowerShell** in the project folder and run:

```powershell
npm install
```

This downloads `express`, `mysql2`, `dotenv`, `cors`, and `nodemon` into the `node_modules/` folder.

---

### STEP 7 — Start the Backend Server

```powershell
npm start
```

You should see:
```
✅ MySQL connected successfully!

🚀 Student Management System is running!
   Local URL : http://localhost:3000
   API base  : http://localhost:3000/api
   Press Ctrl+C to stop the server.
```

---

### STEP 8 — Open the Application

Open your web browser and go to:

```
http://localhost:3000
```

You should see the Student Management System dashboard! 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if server is running |
| GET | `/api/dashboard` | Get dashboard statistics |
| GET | `/api/departments` | List all departments |
| POST | `/api/departments` | Add a department |
| DELETE | `/api/departments/:id` | Delete a department |
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Add a course |
| DELETE | `/api/courses/:id` | Delete a course |
| GET | `/api/students` | List all students (supports `?search=`) |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

---

## 🔧 Troubleshooting

### ❌ "MySQL connection FAILED"
- Make sure MySQL Server is running. Open **Services** in Windows → find **MySQL80** → click **Start**.
- Check your `.env` file: is `DB_PASSWORD` correct?
- Make sure `DB_NAME=student_management` and you ran `schema.sql` first.

### ❌ "Cannot reach the server" banner in browser
- Make sure you ran `npm start` in the project folder.
- Make sure you are visiting `http://localhost:3000` (not opening `index.html` directly).

### ❌ "npm: command not found"
- Node.js is not installed or you haven't restarted PowerShell after installing it.
- Re-install Node.js from https://nodejs.org/ and restart.

### ❌ Port 3000 is already in use
- Change `PORT=3001` in your `.env` file, then restart the server.
- Visit `http://localhost:3001` in the browser.

### ❌ MySQL password forgotten
- During MySQL installation, the root password was set. If forgotten, search for "reset MySQL root password Windows".

---

## 📸 Screenshots to Capture (for submission)

Capture these screenshots to include in your assignment:

1. **Dashboard** — showing student count, course count, department count.
2. **Students page** — table with all 10 sample students.
3. **Add Student form** — filled in with data.
4. **Edit Student modal** — popup with student data.
5. **Search result** — search for a student name.
6. **Courses page** — table with all 4 courses.
7. **Departments page** — table with all 3 departments.
8. **MySQL Workbench** — showing the `student_management` database and tables.
9. **PowerShell terminal** — showing `npm start` output with "MySQL connected".

---

## ✅ Final Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] MySQL Server installed and running
- [ ] MySQL Workbench installed
- [ ] `schema.sql` executed in MySQL
- [ ] `sample_data.sql` executed in MySQL
- [ ] `.env` file created with correct password
- [ ] `npm install` completed
- [ ] `npm start` shows "MySQL connected"
- [ ] Browser shows dashboard at `http://localhost:3000`
- [ ] Can add, edit, delete, and search students
- [ ] Screenshots captured
- [ ] `docs/report.md` filled in with your name and roll number

---

## 📄 Files Created

| File | Purpose |
|------|---------|
| `frontend/index.html` | Main UI page |
| `frontend/style.css` | All styles |
| `frontend/script.js` | Frontend JavaScript |
| `backend/server.js` | Express server |
| `backend/db.js` | MySQL connection |
| `backend/routes/students.js` | Student API |
| `backend/routes/courses.js` | Course API |
| `backend/routes/departments.js` | Department API |
| `backend/routes/dashboard.js` | Dashboard API |
| `database/schema.sql` | Create tables |
| `database/sample_data.sql` | Sample records |
| `database/queries.sql` | SQL examples |
| `docs/report.md` | Assignment report |
| `docs/er-diagram.md` | ER diagram |
| `.env.example` | Environment template |
| `.gitignore` | Git ignore rules |
| `package.json` | Node dependencies |
| `README.md` | This file |
