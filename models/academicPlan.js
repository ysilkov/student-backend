const mongoose = require('mongoose');
const { Schema } = mongoose;

const academicPlanSchema = new mongoose.Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  finalGrade: { type: Number, required: true, min: 1, max: 5 }, 
});

const AcademicPlan = mongoose.model('AcademicPlan', academicPlanSchema);
module.exports = AcademicPlan;