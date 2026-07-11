const connectDB = require('../_lib/db');
const Person = require('../_lib/Person');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  try {
    await connectDB();
    const { id } = req.query;
    const deleted = await Person.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Person not found' });
    res.status(200).json({ status: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete person', details: err.message });
  }
};
