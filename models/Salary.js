const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true,
      min: 2000
    },
    salaryDate: {
      type: Number,
      required: true,
      min: 1,
      max: 31
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    }
  },
  { timestamps: true }
);

salarySchema.index({ year: -1, month: -1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);