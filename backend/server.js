require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

const peopleRoutes    = require('./routes/people');
const visitRoutes     = require('./routes/visits');
const analyticsRoutes = require('./routes/analytics');
const authRoutes      = require('./routes/auth');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth',      authRoutes);
app.use('/api/people',    peopleRoutes);
app.use('/api/visits',    visitRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Serve React build in production ──────────────────────────────────────────
const DIST = path.join(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(DIST));
  // Let React Router handle every non-API route
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
