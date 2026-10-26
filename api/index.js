const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/dashboard', require('../backend/routes/dashboard'));
app.use('/api/departments', require('../backend/routes/departments'));
app.use('/api/courses', require('../backend/routes/courses'));
app.use('/api/students', require('../backend/routes/students'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found.' });
  }

  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('🚀 Student Management System is running!');
    console.log(`Local URL : http://localhost:${PORT}`);
    console.log(`API base  : http://localhost:${PORT}/api`);
  });
}
