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

app.use('/api/auth',      authRoutes);
app.use('/api/people',    peopleRoutes);
app.use('/api/visits',    visitRoutes);
app.use('/api/analytics', analyticsRoutes);

let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};
