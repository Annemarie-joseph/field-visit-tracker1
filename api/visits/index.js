const connectDB = require('../_lib/db');
const Person = require('../_lib/Person');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  try {
    await connectDB();
    const { personId, visitedBy, notes } = req.body || {};
    if (!personId || !visitedBy) {
      return res.status(400).json({ error: 'personId and visitedBy are required' });
    }

    const now = new Date();
    const updated = await Person.findByIdAndUpdate(
      personId,
      {
        $set: { isVisited: true, lastVisitedAt: now },
        $push: { visitLogs: { visitedBy, visitDate: now, notes: notes || '' } },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Person not found' });
    res.status(200).json({ status: 'ok', person: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log visit', details: err.message });
  }
};
