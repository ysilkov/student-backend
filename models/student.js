const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;