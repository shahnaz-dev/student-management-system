// ============================================================
//  backend/db.js
//  Manages the MySQL connection pool using mysql2 and dotenv
// ============================================================

const mysql  = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (better than a single connection for a web app)
const pool = mysql.createPool({
    host    : process.env.DB_HOST     || 'localhost',
    port    : process.env.DB_PORT     || 3306,
    user    : process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'student_management',
    waitForConnections: true,
    connectionLimit   : 10,
    queueLimit        : 0
});

// Test the connection when the app starts
async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log('✅ MySQL connected successfully!');
        conn.release();
    } catch (err) {
        console.error('❌ MySQL connection FAILED!');
        console.error('   Reason:', err.message);
        console.error('   Tip: Make sure MySQL is running and your .env file is correct.');
        // We don't crash the server so we can still show the error in the API
    }
}

testConnection();

module.exports = pool;
