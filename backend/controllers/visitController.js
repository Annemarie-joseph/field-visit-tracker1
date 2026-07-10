const Person = require('../models/Person');

// POST /api/visits
async function logVisit(req, res) {
  try {
    const { personId, notes, type } = req.body;
    if (!personId) {
      return res.status(400).json({ error: 'personId مطلوب' });
    }

    const visitedBy = req.user.username;
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ error: 'الشخص مش موجود' });

    // Regular users can only visit their own people
    if (
      req.user.role !== 'admin' &&
      String(person.createdBy) !== String(req.user.id)
    ) {
      return res.status(403).json({ error: 'مش مسموح تسجل زيارة لشخص مش بتاعك' });
    }

    const now = new Date();
    const updated = await Person.findByIdAndUpdate(
      personId,
      {
        $set:  { lastVisitedAt: now },
        $push: { visitLogs: { visitedBy, visitDate: now, type: type || 'زيارة', notes: notes || '' } },
      },
      { new: true }
    );

    res.status(200).json({ status: 'ok', person: updated });
  } catch (err) {
    res.status(500).json({ error: 'فشل تسجيل الزيارة', details: err.message });
  }
}

module.exports = { logVisit };
