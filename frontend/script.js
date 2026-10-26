/* ============================================================
   Student Management System — script.js
   Frontend JavaScript: connects to REST API using fetch()
   ============================================================ */

'use strict';

// Use the current host when deployed; fall back to localhost in development.
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

// ── In-memory cache for departments and courses (used by dropdowns)
let allDepartments = [];
let allCourses     = [];

// ── Debounce timer for search
let searchTimer = null;

// ════════════════════════════════════════════════════════════
//  INITIALISATION
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    checkServerHealth();
    loadDashboard();
    loadAllDropdownData();   // preload depts & courses for dropdowns
});

// ── Check if the backend server is reachable ────────────────
async function checkServerHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            document.getElementById('server-status').textContent = 'Online';
            document.getElementById('connection-banner').classList.remove('show');
        } else {
            throw new Error('Non-OK response');
        }
    } catch {
        document.getElementById('server-status').textContent = 'Offline';
        document.getElementById('server-status').style.color = 'var(--danger)';
        document.getElementById('connection-banner').classList.add('show');
    }
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
function showSection(name) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Show selected section
    const section = document.getElementById(`section-${name}`);
    if (section) section.classList.add('active');

    // Activate nav item
    const navItem = document.getElementById(`nav-${name}`);
    if (navItem) navItem.classList.add('active');

    // Update top bar title
    const titles = {
        dashboard  : 'Dashboard',
        students   : 'Students',
        courses    : 'Courses',
        departments: 'Departments'
    };
    document.getElementById('page-title').textContent = titles[name] || name;

    // Load fresh data for the section
    if (name === 'dashboard')   loadDashboard();
    if (name === 'students')    loadStudents();
    if (name === 'courses')     loadCourses();
    if (name === 'departments') loadDepartments();

    // Close mobile sidebar
    closeSidebar();
    return false;
}

// ── Mobile sidebar controls ─────────────────────────────────
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

// ════════════════════════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const iconMap   = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.innerHTML = `
        <i class="bi ${iconMap[type] || iconMap.info}"></i>
        <span class="toast-text">${escapeHtml(message)}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut .25s ease forwards';
        setTimeout(() => toast.remove(), 260);
    }, 4000);
}

// ════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════

// Safely escape HTML to prevent XSS
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Generic API call wrapper — handles JSON, network errors, and connection banner
async function apiCall(url, options = {}) {
    try {
        const res  = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        document.getElementById('connection-banner').classList.add('show');
        return { ok: false, status: 0, data: { message: 'Cannot reach the server. Is it running?' } };
    }
}

// ════════════════════════════════════════════════════════════
//  DROPDOWN DATA  (preload departments & courses)
// ════════════════════════════════════════════════════════════
async function loadAllDropdownData() {
    const [dRes, cRes] = await Promise.all([
        apiCall(`${API_BASE}/departments`),
        apiCall(`${API_BASE}/courses`)
    ]);

    if (dRes.ok) allDepartments = dRes.data.data || [];
    if (cRes.ok) allCourses     = cRes.data.data || [];

    populateDeptDropdown('s-dept');
    populateDeptDropdown('c-dept');
    populateDeptDropdown('edit-dept');
    populateCourseDropdown('s-course', '');
    populateCourseDropdown('edit-course', '');
}

function populateDeptDropdown(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">-- Select Department --</option>';
    allDepartments.forEach(d => {
        const opt = document.createElement('option');
        opt.value       = d.dept_id;
        opt.textContent = d.dept_name;
        if (String(d.dept_id) === String(current)) opt.selected = true;
        sel.appendChild(opt);
    });
}

function populateCourseDropdown(selectId, deptId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Select Course --</option>';
    const filtered = deptId
        ? allCourses.filter(c => String(c.dept_id) === String(deptId))
        : allCourses;
    filtered.forEach(c => {
        const opt = document.createElement('option');
        opt.value       = c.course_id;
        opt.textContent = c.course_name;
        sel.appendChild(opt);
    });
}

// Called when user changes the department dropdown in the student form
function filterCoursesByDept(courseSelectId, deptId) {
    populateCourseDropdown(courseSelectId, deptId);
}

// ════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════
async function loadDashboard() {
    const { ok, data } = await apiCall(`${API_BASE}/dashboard`);
    if (!ok) {
        document.getElementById('dept-stats-body').innerHTML = `
            <div class="alert-inline danger">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ${escapeHtml(data.message)}
            </div>`;
        return;
    }

    const d = data.data;
    document.getElementById('stat-students').textContent    = d.total_students;
    document.getElementById('stat-courses').textContent     = d.total_courses;
    document.getElementById('stat-departments').textContent = d.total_departments;

    // Dept distribution bars
    const maxCount = Math.max(...d.dept_stats.map(x => x.student_count), 1);
    const body = document.getElementById('dept-stats-body');

    if (d.dept_stats.length === 0) {
        body.innerHTML = '<div class="empty-state"><i class="bi bi-bar-chart"></i><p>No data yet.</p></div>';
        return;
    }

    body.innerHTML = d.dept_stats.map(row => `
        <div class="dept-stat-row">
            <div class="dept-stat-name">${escapeHtml(row.dept_name)}</div>
            <div class="dept-stat-bar-wrap">
                <div class="dept-stat-bar" style="width:${Math.round((row.student_count / maxCount) * 100)}%"></div>
            </div>
            <div class="dept-stat-count">${row.student_count}</div>
        </div>
    `).join('');
}

// ════════════════════════════════════════════════════════════
//  STUDENTS
// ════════════════════════════════════════════════════════════
async function loadStudents(searchTerm = '') {
    const url = searchTerm
        ? `${API_BASE}/students?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE}/students`;

    const { ok, data } = await apiCall(url);
    const tbody = document.getElementById('students-tbody');

    if (!ok) {
        tbody.innerHTML = `<tr><td colspan="8">
            <div class="alert-inline danger" style="margin:16px;">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ${escapeHtml(data.message)}
            </div>
        </td></tr>`;
        return;
    }

    const students = data.data || [];
    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">
            <div class="empty-state">
                <i class="bi bi-person-x"></i>
                <p>${searchTerm ? 'No students match your search.' : 'No students added yet.'}</p>
            </div>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td style="color:var(--text-muted);">${i + 1}</td>
            <td><span class="roll-badge">${escapeHtml(s.roll_number)}</span></td>
            <td><strong>${escapeHtml(s.full_name)}</strong></td>
            <td><a href="mailto:${escapeHtml(s.email)}" style="color:var(--primary);text-decoration:none;">${escapeHtml(s.email)}</a></td>
            <td>${s.phone ? escapeHtml(s.phone) : '<span style="color:var(--text-muted);">—</span>'}</td>
            <td><span class="dept-pill">${escapeHtml(s.dept_name)}</span></td>
            <td>${escapeHtml(s.course_name)}</td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button
                        class="btn-sm-icon btn-edit"
                        title="Edit"
                        onclick='openEditModal(${JSON.stringify(s)})'
                        id="btn-edit-${s.student_id}"
                    ><i class="bi bi-pencil-fill"></i></button>
                    <button
                        class="btn-sm-icon btn-delete"
                        title="Delete"
                        onclick="deleteStudent(${s.student_id}, '${escapeHtml(s.full_name)}')"
                        id="btn-delete-${s.student_id}"
                    ><i class="bi bi-trash3-fill"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ── Debounced search ────────────────────────────────────────
function searchStudents(value) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadStudents(value), 350);
}

// ── Add student ─────────────────────────────────────────────
async function addStudent(event) {
    event.preventDefault();

    const payload = {
        roll_number: document.getElementById('s-roll').value.trim(),
        full_name  : document.getElementById('s-name').value.trim(),
        email      : document.getElementById('s-email').value.trim(),
        phone      : document.getElementById('s-phone').value.trim(),
        dept_id    : document.getElementById('s-dept').value,
        course_id  : document.getElementById('s-course').value
    };

    const btn = document.getElementById('btn-add-student');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Adding…';

    const { ok, data } = await apiCall(`${API_BASE}/students`, {
        method: 'POST',
        body  : JSON.stringify(payload)
    });

    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-plus-circle"></i> Add Student';

    if (ok) {
        showToast(data.message, 'success');
        clearStudentForm();
        loadStudents();
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ── Clear add form ──────────────────────────────────────────
function clearStudentForm() {
    document.getElementById('form-add-student').reset();
    populateCourseDropdown('s-course', '');
}

// ── Open edit modal ─────────────────────────────────────────
async function openEditModal(student) {
    // Refresh dropdown data first
    await loadAllDropdownData();

    document.getElementById('edit-student-id').value = student.student_id;
    document.getElementById('edit-roll').value        = student.roll_number;
    document.getElementById('edit-name').value        = student.full_name;
    document.getElementById('edit-email').value       = student.email;
    document.getElementById('edit-phone').value       = student.phone || '';

    populateDeptDropdown('edit-dept');
    document.getElementById('edit-dept').value = student.dept_id;

    filterCoursesByDept('edit-course', student.dept_id);
    // Wait one tick for the DOM to update
    setTimeout(() => {
        document.getElementById('edit-course').value = student.course_id;
    }, 50);

    document.getElementById('edit-student-modal').classList.add('open');
}

function closeEditModal() {
    document.getElementById('edit-student-modal').classList.remove('open');
}

// ── Save edited student ─────────────────────────────────────
async function saveEditStudent(event) {
    event.preventDefault();

    const id = document.getElementById('edit-student-id').value;
    const payload = {
        roll_number: document.getElementById('edit-roll').value.trim(),
        full_name  : document.getElementById('edit-name').value.trim(),
        email      : document.getElementById('edit-email').value.trim(),
        phone      : document.getElementById('edit-phone').value.trim(),
        dept_id    : document.getElementById('edit-dept').value,
        course_id  : document.getElementById('edit-course').value
    };

    const { ok, data } = await apiCall(`${API_BASE}/students/${id}`, {
        method: 'PUT',
        body  : JSON.stringify(payload)
    });

    if (ok) {
        showToast(data.message, 'success');
        closeEditModal();
        loadStudents(document.getElementById('student-search').value);
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ── Delete student ──────────────────────────────────────────
async function deleteStudent(id, name) {
    if (!confirm(`Are you sure you want to delete student "${name}"?\nThis action cannot be undone.`)) return;

    const { ok, data } = await apiCall(`${API_BASE}/students/${id}`, { method: 'DELETE' });

    if (ok) {
        showToast(data.message, 'success');
        loadStudents(document.getElementById('student-search').value);
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ════════════════════════════════════════════════════════════
//  COURSES
// ════════════════════════════════════════════════════════════
async function loadCourses() {
    const { ok, data } = await apiCall(`${API_BASE}/courses`);
    const tbody = document.getElementById('courses-tbody');

    if (!ok) {
        tbody.innerHTML = `<tr><td colspan="5">
            <div class="alert-inline danger" style="margin:16px;">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ${escapeHtml(data.message)}
            </div>
        </td></tr>`;
        return;
    }

    const courses = data.data || [];
    if (courses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">
            <div class="empty-state">
                <i class="bi bi-book"></i>
                <p>No courses added yet.</p>
            </div>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = courses.map((c, i) => `
        <tr>
            <td style="color:var(--text-muted);">${i + 1}</td>
            <td><span class="roll-badge">${c.course_id}</span></td>
            <td><strong>${escapeHtml(c.course_name)}</strong></td>
            <td><span class="dept-pill">${escapeHtml(c.dept_name)}</span></td>
            <td>
                <button
                    class="btn-sm-icon btn-delete"
                    title="Delete"
                    onclick="deleteCourse(${c.course_id}, '${escapeHtml(c.course_name)}')"
                    id="btn-del-course-${c.course_id}"
                ><i class="bi bi-trash3-fill"></i></button>
            </td>
        </tr>
    `).join('');
}

// ── Add course ──────────────────────────────────────────────
async function addCourse(event) {
    event.preventDefault();

    const payload = {
        course_name: document.getElementById('c-name').value.trim(),
        dept_id    : document.getElementById('c-dept').value
    };

    const { ok, data } = await apiCall(`${API_BASE}/courses`, {
        method: 'POST',
        body  : JSON.stringify(payload)
    });

    if (ok) {
        showToast(data.message, 'success');
        document.getElementById('form-add-course').reset();
        loadCourses();
        await loadAllDropdownData(); // refresh dropdowns
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ── Delete course ───────────────────────────────────────────
async function deleteCourse(id, name) {
    if (!confirm(`Delete course "${name}"?`)) return;

    const { ok, data } = await apiCall(`${API_BASE}/courses/${id}`, { method: 'DELETE' });

    if (ok) {
        showToast(data.message, 'success');
        loadCourses();
        await loadAllDropdownData();
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ════════════════════════════════════════════════════════════
//  DEPARTMENTS
// ════════════════════════════════════════════════════════════
async function loadDepartments() {
    const { ok, data } = await apiCall(`${API_BASE}/departments`);
    const tbody = document.getElementById('departments-tbody');

    if (!ok) {
        tbody.innerHTML = `<tr><td colspan="4">
            <div class="alert-inline danger" style="margin:16px;">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ${escapeHtml(data.message)}
            </div>
        </td></tr>`;
        return;
    }

    const depts = data.data || [];
    if (depts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">
            <div class="empty-state">
                <i class="bi bi-building"></i>
                <p>No departments added yet.</p>
            </div>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = depts.map((d, i) => `
        <tr>
            <td style="color:var(--text-muted);">${i + 1}</td>
            <td><span class="roll-badge">${d.dept_id}</span></td>
            <td><strong>${escapeHtml(d.dept_name)}</strong></td>
            <td>
                <button
                    class="btn-sm-icon btn-delete"
                    title="Delete"
                    onclick="deleteDepartment(${d.dept_id}, '${escapeHtml(d.dept_name)}')"
                    id="btn-del-dept-${d.dept_id}"
                ><i class="bi bi-trash3-fill"></i></button>
            </td>
        </tr>
    `).join('');
}

// ── Add department ──────────────────────────────────────────
async function addDepartment(event) {
    event.preventDefault();

    const payload = { dept_name: document.getElementById('d-name').value.trim() };

    const { ok, data } = await apiCall(`${API_BASE}/departments`, {
        method: 'POST',
        body  : JSON.stringify(payload)
    });

    if (ok) {
        showToast(data.message, 'success');
        document.getElementById('form-add-dept').reset();
        loadDepartments();
        await loadAllDropdownData(); // refresh dropdowns
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}

// ── Delete department ───────────────────────────────────────
async function deleteDepartment(id, name) {
    if (!confirm(`Delete department "${name}"?\nThis will fail if courses or students are linked to it.`)) return;

    const { ok, data } = await apiCall(`${API_BASE}/departments/${id}`, { method: 'DELETE' });

    if (ok) {
        showToast(data.message, 'success');
        loadDepartments();
        await loadAllDropdownData();
        loadDashboard();
    } else {
        showToast(data.message, 'error');
    }
}
