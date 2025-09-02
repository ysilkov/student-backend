const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lecturesHours: { type: Number, required: true },
  practiceHours: { type: Number, required: true },
  labHours: { type: Number, required: true },
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;