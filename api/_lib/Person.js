const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema(
  {
    visitedBy: { type: String, required: true, trim: true },
    visitDate: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    neighborhood: { type: String, trim: true, default: 'Unassigned' },
    isVisited: { type: Boolean, default: false },
    lastVisitedAt: { type: Date, default: null },
    visitLogs: { type: [visitLogSchema], default: [] },
  },
  { timestamps: true }
);

personSchema.index({ isVisited: 1, name: 1 });

module.exports = mongoose.models.Person || mongoose.model('Person', personSchema);
