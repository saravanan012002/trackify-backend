const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    color: {
      type: String,
      default: "#F3F0FF"
    },
    pinned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

noteSchema.index({ pinned: -1, updatedAt: -1 });

module.exports = mongoose.model("Note", noteSchema);