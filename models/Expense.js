const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
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
      required: true
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

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);