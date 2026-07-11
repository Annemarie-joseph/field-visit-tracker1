const connectDB = require('../_lib/db');
const Person = require('../_lib/Person');

module.exports = async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const people = await Person.find().sort({ name: 1 });
      return res.status(200).json(people);
    }

    if (req.method === 'POST') {
      const { name, age, phone, address, neighborhood } = req.body || {};
      if (!name || age === undefined) {
        return res.status(400).json({ error: 'name and age are required' });
      }
      const person = await Person.create({ name, age, phone, address, neighborhood });
      return res.status(201).json(person);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    return res.status(500).json({ error: 'Request failed', details: err.message });
  }
};
