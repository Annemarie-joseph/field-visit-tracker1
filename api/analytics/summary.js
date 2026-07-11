const connectDB = require('../_lib/db');
const Person = require('../_lib/Person');

const AGE_COHORTS = [
  { label: '17-20', min: 17, max: 20 },
  { label: '21-25', min: 21, max: 25 },
  { label: '26-30', min: 26, max: 30 },
];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await connectDB();

    const [overall] = await Person.aggregate([
      { $group: { _id: null, total: { $sum: 1 }, visited: { $sum: { $cond: ['$isVisited', 1, 0] } } } },
    ]);

    const byNeighborhood = await Person.aggregate([
      { $group: { _id: '$neighborhood', total: { $sum: 1 }, visited: { $sum: { $cond: ['$isVisited', 1, 0] } } } },
      {
        $project: {
          _id: 0,
          neighborhood: '$_id',
          total: 1,
          visited: 1,
          rate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$visited', '$total'] }, 100] }, 0] },
            ],
          },
        },
      },
      { $sort: { neighborhood: 1 } },
    ]);

    const byAgeCohort = await Promise.all(
      AGE_COHORTS.map(async (cohort) => {
        const total = await Person.countDocuments({ age: { $gte: cohort.min, $lte: cohort.max } });
        const visited = await Person.countDocuments({ age: { $gte: cohort.min, $lte: cohort.max }, isVisited: true });
        return { label: cohort.label, total, visited, rate: total === 0 ? 0 : Math.round((visited / total) * 100) };
      })
    );

    const overallRate = overall && overall.total ? Math.round((overall.visited / overall.total) * 100) : 0;
    const flagThreshold = 20;
    const flagged = (rows) => rows.map((r) => ({ ...r, flagged: r.total > 0 && overallRate - r.rate >= flagThreshold }));

    res.status(200).json({
      total: overall ? overall.total : 0,
      visited: overall ? overall.visited : 0,
      overallRate,
      byNeighborhood: flagged(byNeighborhood),
      byAgeCohort: flagged(byAgeCohort),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics', details: err.message });
  }
};
