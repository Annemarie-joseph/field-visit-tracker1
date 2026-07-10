const Person = require('../models/Person');

// GET /api/people
async function getAll(req, res) {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const people = await Person.find(filter).sort({ fullName: 1 });
    res.status(200).json(people);
  } catch (err) {
    res.status(500).json({ error: 'فشل في جلب البيانات', details: err.message });
  }
}

// GET /api/people/pending  (field worklist — people not yet contacted this month)
async function getPending(req, res) {
  try {
    const now           = new Date();
    const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
    const ownerFilter   = req.user.role === 'admin' ? {} : { createdBy: req.user.id };

    // Exclude anyone who already has a visitLog entry this calendar month
    const people = await Person.find({
      ...ownerFilter,
      visitLogs: { $not: { $elemMatch: { visitDate: { $gte: startOfMonth } } } },
    }).sort({ fullName: 1 });

    res.status(200).json(people);
  } catch (err) {
    res.status(500).json({ error: 'فشل في جلب القائمة', details: err.message });
  }
}

// POST /api/people
async function createPerson(req, res) {
  try {
    const {
      fullName, dateOfBirth, age, education, job,
      fatherOfConfession, phone, maritalStatus, neighborhood, visitNotes,
    } = req.body;

    // Required fields (visitNotes is optional)
    if (!fullName || !dateOfBirth || age === undefined || !education || !job ||
        !fatherOfConfession || !phone || !maritalStatus || !neighborhood) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة عدا الملاحظات' });
    }

    // Name must contain letters only
    if (!/^[\p{L}\s]+$/u.test(fullName.trim())) {
      return res.status(400).json({ error: 'الاسم يجب أن يحتوي على حروف فقط بدون أرقام أو رموز' });
    }

    // Age range 17–30
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 17 || ageNum > 30) {
      return res.status(400).json({ error: 'السن يجب أن يكون بين 17 و 30 سنة' });
    }

    const person = await Person.create({
      createdBy: req.user.id,
      fullName: fullName.trim(),
      dateOfBirth,
      age: ageNum,
      education,
      job,
      fatherOfConfession,
      phone,
      maritalStatus,
      neighborhood,
      visitNotes: visitNotes || '',
    });
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: 'فشل في حفظ البيانات', details: err.message });
  }
}

// DELETE /api/people/:id  (admin only — enforced at route level)
async function deletePerson(req, res) {
  try {
    const deleted = await Person.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'الشخص مش موجود' });
    res.status(200).json({ status: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: 'فشل في الحذف', details: err.message });
  }
}

module.exports = { getAll, getPending, createPerson, deletePerson };
