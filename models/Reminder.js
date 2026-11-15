const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    dateTime: {
      type: Date,
      required: true
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none"
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

reminderSchema.index({ dateTime: 1, completed: 1 });

module.exports = mongoose.model("Reminder", reminderSchema);