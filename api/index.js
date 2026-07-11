const express        = require('express');
const cors           = require('cors');
const connectDB      = require('../backend/config/db');
const authRoutes     = require('../backend/routes/auth');
const peopleRoutes   = require('../backend/routes/people');
const visitRoutes    = require('../backend/routes/visits');
const analyticsRoutes = require('../backend/routes/analytics');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Serverless Request] Method: ${req.method}, URL: ${req.url}, OriginalURL: ${req.originalUrl}`);
  next();
});

app.use('/api/auth',      authRoutes);
app.use('/auth',          authRoutes);

app.use('/api/people',    peopleRoutes);
app.use('/people',        peopleRoutes);

app.use('/api/visits',    visitRoutes);
app.use('/visits',        visitRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics',     analyticsRoutes);

let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};
