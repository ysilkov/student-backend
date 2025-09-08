const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new mongoose.Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  name: { type: String, required: true },
  lecturesHours: { type: Number, required: true },
  practiceHours: { type: Number, required: true },
  labHours: { type: Number, required: true }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;