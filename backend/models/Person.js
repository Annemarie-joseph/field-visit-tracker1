const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema(
  {
    visitedBy: { type: String, required: true, trim: true },
    visitDate: { type: Date,   required: true, default: Date.now },
    type:      { type: String, enum: ['زيارة', 'اتصال'], default: 'زيارة' },
    notes:     { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const personSchema = new mongoose.Schema(
  {
    createdBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    fullName:          { type: String, required: true, trim: true, match: [/^[\p{L}\s]+$/u, 'الاسم يجب أن يحتوي على حروف فقط'] },
    dateOfBirth:       { type: Date,   required: true },
    age:               { type: Number, required: true, min: [17, 'السن يجب أن يكون 17 على الأقل'], max: [30, 'السن يجب أن يكون 30 على الأكثر'] },
    education:         { type: String, required: true, trim: true },
    job:               { type: String, required: true, trim: true },
    fatherOfConfession:{ type: String, required: true, trim: true },
    phone:             { type: String, required: true, trim: true },
    maritalStatus:     { type: String, required: true, enum: ['أعزب', 'متجوز', 'مطلق', 'أرمل'] },
    neighborhood:      { type: String, required: true, trim: true },
    visitNotes:        { type: String, trim: true, default: '' },
    isVisited:         { type: Boolean, default: false },
    lastVisitedAt:     { type: Date, default: null },
    visitLogs:         { type: [visitLogSchema], default: [] },
  },
  { timestamps: true }
);

// Speeds up the primary pending-queue query used by the field client.
personSchema.index({ isVisited: 1, name: 1 });

module.exports = mongoose.model('Person', personSchema);
