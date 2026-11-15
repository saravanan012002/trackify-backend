const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
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

incomeSchema.index({ date: -1 });

module.exports = mongoose.model("Income", incomeSchema);