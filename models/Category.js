const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    type: {
      type: String,
      enum: ["expense", "income", "both"],
      default: "expense"
    },
    icon: {
      type: String,
      default: "category"
    },
    color: {
      type: String,
      default: "#6C4CF1"
    }
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);