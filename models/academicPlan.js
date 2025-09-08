const mongoose = require("mongoose");
const { Schema } = mongoose;

const academicPlanSchema = new mongoose.Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    finalGrade: { type: Number, default: null },
  },
  { timestamps: true }
);

const AcademicPlan = mongoose.model("AcademicPlan", academicPlanSchema);
module.exports = AcademicPlan;
