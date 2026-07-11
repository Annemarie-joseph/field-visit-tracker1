const connectDB = require('../_lib/db');
const Person = require('../_lib/Person');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  try {
    await connectDB();
    const pending = await Person.find({ isVisited: false }).sort({ name: 1 });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending list', details: err.message });
  }
};
